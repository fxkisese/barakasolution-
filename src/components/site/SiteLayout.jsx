import { Outlet } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import CartDrawer from "@/components/site/CartDrawer";

export default function SiteLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-silk">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloat />
            <CartDrawer />
        </div>
    );
}
