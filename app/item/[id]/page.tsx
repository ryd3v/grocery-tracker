"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ItemDetails from '../../../components/ItemDetails';

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

const ItemPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const id = params.id;
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        if (id) {
            const storedItems = localStorage.getItem('grocery-items');
            if (storedItems) {
                const items: Item[] = JSON.parse(storedItems);
                const item = items.find(item => item.id === parseInt(id));
                setItem(item || null);
            }
        }
    }, [id]);

    const handleSave = (updatedItem: Item) => {
        const storedItems = localStorage.getItem('grocery-items');
        if (storedItems) {
            const items: Item[] = JSON.parse(storedItems);
            const updatedItems = items.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            );
            localStorage.setItem('grocery-items', JSON.stringify(updatedItems));
            router.push('/');
        }
    };

    if (!id) {
        return <div>Loading...</div>;
    }

    return item ? <ItemDetails item={item} onSave={handleSave} /> : <div>Loading...</div>;
};

export default ItemPage;
