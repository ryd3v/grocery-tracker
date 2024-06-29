'use client';

import {FormEvent, useEffect, useState} from 'react';

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
        calculateMonthlyTotals(updatedItems);
        calculateTotalStock(updatedItems);
        setForm({name: '', cost: '', quantity: '', expiry: ''});
        setError('');
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Item</button>
            </form>
            <div>
                <h2 className="text-xl font-semibold mb-2">Items</h2>
                <ul>
                    {items.map(item => (
                        <li key={item.id} className="border p-2 mb-2">
                            {item.name} - ${item.cost} - {item.quantity} - {item.expiry}
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
