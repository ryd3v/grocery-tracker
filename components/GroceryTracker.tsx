"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { parse } from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Item {
    id: number;
    name: string;
    cost: number;
    quantity: number;
    expiry: string;
    dateAdded: string;
    servingSize?: string;
    calories?: number;
    fat?: number;
    carbohydrates?: number;
    protein?: number;
    sodium?: number;
}

export default function GroceryTracker() {
    const [items, setItems] = useState<Item[]>([]);
    const [form, setForm] = useState({ name: '', cost: '', quantity: '', expiry: '' });
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [monthlyTotals, setMonthlyTotals] = useState<{ [key: string]: number }>({});
    const [totalStock, setTotalStock] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const router = useRouter();

    useEffect(() => {
        const storedItems = localStorage.getItem('grocery-items');
        if (storedItems) {
            const parsedItems: Item[] = JSON.parse(storedItems).map((item: Item) => ({
                ...item,
                dateAdded: item.dateAdded || new Date().toISOString().slice(0, 10), // Ensure dateAdded is set
            }));
            setItems(parsedItems);
            calculateMonthlyTotals(parsedItems);
            calculateTotalStock(parsedItems);
        }
    }, []);

    const calculateMonthlyTotals = (items: Item[]) => {
        const totals: { [key: string]: number } = {};
        items.forEach(item => {
            const month = item.dateAdded.slice(0, 7); // Format: YYYY-MM
            if (!totals[month]) {
                totals[month] = 0;
            }
            totals[month] += item.cost;
        });
        setMonthlyTotals(totals);
    };

    const calculateTotalStock = (items: Item[]) => {
        const stock = items.reduce((total, item) => total + item.quantity, 0);
        setTotalStock(stock);
    };

    const addItem = (e: FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.cost || !form.quantity || !form.expiry) {
            setError('All fields are required');
            return;
        }
        if (isNaN(parseFloat(form.cost)) || isNaN(parseInt(form.quantity))) {
            setError('Cost and Quantity must be valid numbers');
            return;
        }

        if (editingItemId !== null) {
            const updatedItems = items.map(item =>
                item.id === editingItemId ? {
                    ...item, ...form,
                    cost: parseFloat(form.cost),
                    quantity: parseInt(form.quantity)
                } : item
            );
            setItems(updatedItems);
            localStorage.setItem('grocery-items', JSON.stringify(updatedItems));
            setEditingItemId(null);
            setNotification({ message: 'Item updated successfully', type: 'success' });
        } else {
            const newItem = {
                id: Date.now(),
                name: form.name,
                cost: parseFloat(form.cost),
                quantity: parseInt(form.quantity),
                expiry: form.expiry,
                dateAdded: new Date().toISOString().slice(0, 10), // Format: YYYY-MM-DD
            };
            const updatedItems = [...items, newItem];
            setItems(updatedItems);
            localStorage.setItem('grocery-items', JSON.stringify(updatedItems));
            setNotification({ message: 'Item added successfully', type: 'success' });
        }

        calculateMonthlyTotals(items);
        calculateTotalStock(items);
        setForm({ name: '', cost: '', quantity: '', expiry: '' });
        setError('');
    };

    const editItem = (id: number) => {
        const itemToEdit = items.find(item => item.id === id);
        if (itemToEdit) {
            setForm({
                name: itemToEdit.name,
                cost: itemToEdit.cost.toString(),
                quantity: itemToEdit.quantity.toString(),
                expiry: itemToEdit.expiry
            });
            setEditingItemId(id);
        }
    };

    const deleteItem = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            localStorage.setItem('grocery-items', JSON.stringify(updatedItems));
            calculateMonthlyTotals(updatedItems);
            calculateTotalStock(updatedItems);
        }
    };

    const viewItemDetails = (id: number) => {
        router.push(`/item/${id}`);
    };

    const convertToCSV = (items: Item[]) => {
        const header = "id,name,cost,quantity,expiry,dateAdded,servingSize,calories,fat,carbohydrates,protein,sodium\n";
        const rows = items.map(item => `${item.id},${item.name},${item.cost},${item.quantity},${item.expiry},${item.dateAdded},${item.servingSize || ''},${item.calories || ''},${item.fat || ''},${item.carbohydrates || ''},${item.protein || ''},${item.sodium || ''}`).join("\n");
        return header + rows;
    };

    const exportToCSV = () => {
        const csvData = convertToCSV(items);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'grocery_data.csv');
    };

    const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result?.toString();
                if (text) {
                    const result = parse<Item>(text, { header: true, dynamicTyping: true });
                    const newItems = result.data.map(item => ({
                        ...item,
                        id: item.id || Date.now(),
                        dateAdded: item.dateAdded || new Date().toISOString().slice(0, 10),
                    }));
                    setItems([...items, ...newItems]);
                    localStorage.setItem('grocery-items', JSON.stringify([...items, ...newItems]));
                    calculateMonthlyTotals([...items, ...newItems]);
                    calculateTotalStock([...items, ...newItems]);
                    setNotification({ message: 'Items imported successfully', type: 'success' });
                }
                setIsLoading(false);
            };
            reader.readAsText(file);
        }
    };

    const chartData = {
        labels: Object.keys(monthlyTotals).map(month => {
            const date = new Date(month);
            return date.toLocaleString('default', { month: 'long', year: 'numeric' });
        }),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: Object.values(monthlyTotals),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mx-auto p-4">
            {notification.type && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {notification.message}
                </div>
            )}
            {isLoading && <div
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-500">Loading...</div>}
            <h1 className="text-3xl font-bold mb-4 uppercase">Grocery Tracker</h1>
            <form onSubmit={addItem} className="grid gap-4 mb-4 md:grid-cols-2">
                {error && <div className="col-span-2 mb-2 text-red-600">{error}</div>}
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Cost</label>
                    <input
                        type="number"
                        value={form.cost}
                        onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Expiry Date</label>
                    <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>

                <button type="submit"
                        className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                    {editingItemId !== null ? 'Update Item' : 'Add Item'}
                </button>
            </form>

            <div className="flex justify-between mb-4">
                <button onClick={exportToCSV}
                        className="px-4 py-2 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
                    Export to CSV
                </button>
                <label
                    className="shadow-[inset_0_0_0_2px_#616467] text-black px-4 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
                    Import from CSV
                    <input type="file" accept=".csv" onChange={importFromCSV} className="hidden" />
                </label>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map(item => (
                        <div key={item.id} className="p-4 rounded shadow bg-zinc-200 dark:bg-zinc-900">
                            <div className="font-bold text-blue-500 underline text-lg cursor-pointer" onClick={() => viewItemDetails(item.id)}>
                                {item.name}
                            </div>
                            <div>Cost: ${item.cost}</div>
                            <div>Quantity: {item.quantity}</div>
                            <div>Expiry: {item.expiry}</div>
                            <div className="mt-2">
                                <button onClick={() => editItem(item.id)} className="text-sm mr-2 text-blue-500">Edit</button>
                                <button onClick={() => deleteItem(item.id)} className="text-sm text-red-500">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8 flex justify-between items-start">
                <div className="w-1/2 pr-4">
                    <h2 className="text-2xl font-semibold mb-2 underline ml-2">Monthly Totals</h2>
                    <ul>
                        {Object.keys(monthlyTotals).map(month => {
                            const date = new Date(month);
                            const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                            return (
                                <li key={month} className="p-2 mb-2 rounded-md text-xl">
                                    <span>{formattedDate}: </span>
                                    <span className="text-red-600">${monthlyTotals[month].toFixed(2)}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="w-1/2 pl-4">
                    <h2 className="text-xl font-semibold mb-2">Total Stock</h2>
                    <p>{totalStock}</p>
                </div>
            </div>
            <div className="py-8">
                <h2 className="text-2xl font-semibold mb-4">Monthly Expenses Chart</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}
