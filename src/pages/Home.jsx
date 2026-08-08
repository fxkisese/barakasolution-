import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import NewArrivals from "@/components/site/NewArrivals";
import ShopByCategory from "@/components/site/ShopByCategory";
import InstagramFeed from "@/components/site/InstagramFeed";
import Location from "@/components/site/Location";
import Newsletter from "@/components/site/Newsletter";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import CartDrawer from "@/components/site/CartDrawer";

export default function Home() {
    return (
        <div className="scroll-smooth bg-silk">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <NewArrivals />
                <ShopByCategory />
                <InstagramFeed />
                <Location />
                <Newsletter />
            </main>
            <Footer />
            <WhatsAppFloat />
            <CartDrawer />
        </div>
    );
}
