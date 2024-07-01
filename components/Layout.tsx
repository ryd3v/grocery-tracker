import Navbar from './Navbar';
import Footer from "@/components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <Footer/>
        </div>
    );
};

export default MainLayout;
