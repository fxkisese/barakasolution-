import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import NewArrivals from "@/components/site/NewArrivals";
import ShopByCategory from "@/components/site/ShopByCategory";
import InstagramFeed from "@/components/site/InstagramFeed";
import TiktokFeed from "@/components/site/TiktokFeed";
import Location from "@/components/site/Location";
import ContactForm from "@/components/site/ContactForm";
import Newsletter from "@/components/site/Newsletter";
import SignupBanner from "@/components/site/SignupBanner";

export default function Home() {
    return (
        <div className="scroll-smooth">
            <SignupBanner />
            <Hero />
            <Features />
            <NewArrivals />
            <ShopByCategory />
            <InstagramFeed />
            <TiktokFeed />
            <Location />
            <ContactForm />
            <Newsletter />
        </div>
    );
}
