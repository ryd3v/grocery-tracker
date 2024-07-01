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
            <div>
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
            <div className='max-w-6 mt-4'>
                <button
                    onClick={handleSave}
                    className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-4 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
                >
                    Save
                </button>
            </div>

        </div>
    );
};

export default ItemDetails;
