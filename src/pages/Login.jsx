import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import FeaturedCollections from "@/components/site/FeaturedCollections";
import Features from "@/components/site/Features";
import NewArrivals from "@/components/site/NewArrivals";
import Testimonials from "@/components/site/Testimonials";
import ShopByCategory from "@/components/site/ShopByCategory";
import Newsletter from "@/components/site/Newsletter";
import Blog from "@/components/site/Blog";
import Footer from "@/components/site/Footer";

export default function Home() {
    return (
        <div className="scroll-smooth bg-silk">
            <Navbar />
            <main>
                <Hero />
                <FeaturedCollections />
                <Features />
                <NewArrivals />
                <Testimonials />
                <ShopByCategory />
                <Newsletter />
                <Blog />
            </main>
            <Footer />
        </div>
    );
}