import { useState } from 'react';

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

interface ItemDetailsProps {
    item: Item;
    onSave: (updatedItem: Item) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onSave }) => {
    const [details, setDetails] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = () => {
        onSave(details);
    };

    return (
        <div className="container mx-auto p-4 min-h-screen flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Item Details</h2>
            <div className="flex-grow">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Serving Size</label>
                    <input
                        type="text"
                        name="servingSize"
                        value={details.servingSize || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Calories</label>
                    <input
                        type="number"
                        name="calories"
                        value={details.calories || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Fat (g)</label>
                    <input
                        type="number"
                        name="fat"
                        value={details.fat || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Carbohydrates (g)</label>
                    <input
                        type="number"
                        name="carbohydrates"
                        value={details.carbohydrates || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Protein (g)</label>
                    <input
                        type="number"
                        name="protein"
                        value={details.protein || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Sodium (mg)</label>
                    <input
                        type="number"
                        name="sodium"
                        value={details.sodium || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    />
                </div>
            </div>
            <button
                onClick={handleSave}
                className="mt-4 px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 self-start"
            >
                Save
            </button>
        </div>
    );
};

export default ItemDetails;
