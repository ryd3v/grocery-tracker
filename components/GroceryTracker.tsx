'use client'; // This directive makes the component a Client Component

import {FormEvent, useState} from 'react';

interface Item {
    id: number;
    name: string;
    cost: number;
    quantity: number;
    expiry: string;
}

export default function GroceryTracker() {
    const [items, setItems] = useState<Item[]>([]);
    const [form, setForm] = useState({name: '', cost: '', quantity: '', expiry: ''});

    const addItem = (e: FormEvent) => {
        e.preventDefault();
        setItems([...items, {
            id: Date.now(),
            name: form.name,
            cost: parseFloat(form.cost),
            quantity: parseInt(form.quantity),
            expiry: form.expiry
        }]);
        setForm({name: '', cost: '', quantity: '', expiry: ''});
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Grocery Tracker</h1>
            <form onSubmit={addItem} className="mb-4">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full p-2 border"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Cost</label>
                    <input
                        type="number"
                        value={form.cost}
                        onChange={(e) => setForm({...form, cost: e.target.value})}
                        className="w-full p-2 border"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({...form, quantity: e.target.value})}
                        className="w-full p-2 border"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Expiry Date</label>
                    <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) => setForm({...form, expiry: e.target.value})}
                        className="w-full p-2 border"
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
        </div>
    );
}
