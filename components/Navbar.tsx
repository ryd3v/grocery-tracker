import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    return (
        <nav className="bg-[#0070f3] dark:bg-zinc-900 text-white p-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2"/>
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
