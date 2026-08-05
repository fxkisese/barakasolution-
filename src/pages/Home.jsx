import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import NewArrivals from "@/components/site/NewArrivals";
import ShopByCategory from "@/components/site/ShopByCategory";
import Newsletter from "@/components/site/Newsletter";
import Footer from "@/components/site/Footer";

export default function Home() {
    return (
        <div className="scroll-smooth bg-silk">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <NewArrivals />
                <ShopByCategory />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
}
