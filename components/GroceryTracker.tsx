'use client';

import {FormEvent, useEffect, useState} from 'react';
import {saveAs} from 'file-saver';
import {parse} from 'papaparse';

interface Item {
    id: number;
    name: string;
    cost: number;
    quantity: number;
    expiry: string;
    dateAdded: string;
}

export default function GroceryTracker() {
    const [items, setItems] = useState<Item[]>([]);
    const [form, setForm] = useState({name: '', cost: '', quantity: '', expiry: ''});
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [monthlyTotals, setMonthlyTotals] = useState<{ [key: string]: number }>({});
    const [totalStock, setTotalStock] = useState<number>(0);
    const [error, setError] = useState<string>('');

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
        }

        calculateMonthlyTotals(items);
        calculateTotalStock(items);
        setForm({name: '', cost: '', quantity: '', expiry: ''});
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
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        localStorage.setItem('grocery-items', JSON.stringify(updatedItems));
        calculateMonthlyTotals(updatedItems);
        calculateTotalStock(updatedItems);
    };

    // Function to convert items to CSV format
    const convertToCSV = (items: Item[]) => {
        const header = "id,name,cost,quantity,expiry,dateAdded\n";
        const rows = items.map(item => `${item.id},${item.name},${item.cost},${item.quantity},${item.expiry},${item.dateAdded}`).join("\n");
        return header + rows;
    };

    // Function to export items to a CSV file
    const exportToCSV = () => {
        const csvData = convertToCSV(items);
        const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
        saveAs(blob, 'grocery_data.csv');
    };

    // Function to import items from a CSV file
    const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result?.toString();
                if (text) {
                    const result = parse<Item>(text, {header: true, dynamicTyping: true});
                    const newItems = result.data.map(item => ({
                        ...item,
                        id: item.id || Date.now(),
                        dateAdded: item.dateAdded || new Date().toISOString().slice(0, 10),
                    }));
                    setItems([...items, ...newItems]);
                    localStorage.setItem('grocery-items', JSON.stringify([...items, ...newItems]));
                    calculateMonthlyTotals([...items, ...newItems]);
                    calculateTotalStock([...items, ...newItems]);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Grocery Tracker</h1>
            <form onSubmit={addItem} className="mb-4">
                {error && <div className="mb-2 text-red-600">{error}</div>}
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full p-2 border dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Cost</label>
                    <input
                        type="number"
                        value={form.cost}
                        onChange={(e) => setForm({...form, cost: e.target.value})}
                        className="w-full p-2 border dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({...form, quantity: e.target.value})}
                        className="w-full p-2 border dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Expiry Date</label>
                    <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) => setForm({...form, expiry: e.target.value})}
                        className="w-full p-2 border dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <button type="submit"
                        className="bg-blue-500 text-white px-4 py-2">{editingItemId !== null ? 'Update Item' : 'Add Item'}</button>
            </form>
            <div>
                <button onClick={exportToCSV} className="bg-green-500 text-white px-4 py-2 mb-4">Export to CSV</button>
                <input type="file" accept=".csv" onChange={importFromCSV} className="mb-4"/>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                <ul>
                    {items.map(item => (
                        <li key={item.id} className="border p-2 mb-2">
                            {item.name} - ${item.cost} - {item.quantity} - {item.expiry}
                            <button onClick={() => editItem(item.id)} className="ml-2 text-blue-500">Edit</button>
                            <button onClick={() => deleteItem(item.id)} className="ml-2 text-red-500">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Monthly Totals</h2>
                <ul>
                    {Object.keys(monthlyTotals).map(month => (
                        <li key={month} className="border p-2 mb-2 text-red-600 font-semibold">
                            {month}: ${monthlyTotals[month].toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Total Stock</h2>
                <p>{totalStock}</p>
            </div>
        </div>
    );
}
