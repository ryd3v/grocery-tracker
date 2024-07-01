import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-blue-500 dark:bg-zinc-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <p className="text-xl font-bold">Grocery Tracker</p>
                </Link>
                <div>
                    <Link href="/">
                        <p className="mr-4">Home</p>
                    </Link>
                    {/* Add more links here if needed */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
