import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Gallery from '@/pages/Gallery';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import TestimonialsPage from '@/pages/TestimonialsPage';
import Blog from '@/pages/Blog';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import AdminPanel from '@/pages/admin/AdminPanel';
import SiteLayout from '@/components/site/SiteLayout';

const AuthenticatedApp = () => {
    const { isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Site Routes wrapped in Layout */}
            <Route path="/" element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="services" element={<Services />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="blog" element={<Blog />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
            </Route>

            {/* Full admin panel — handles all /admin/* routes internally */}
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <QueryClientProvider client={queryClientInstance}>
                    <Router>
                        <ScrollToTop />
                        <AuthenticatedApp />
                    </Router>
                    <Toaster />
                </QueryClientProvider>
            </CartProvider>
        </AuthProvider>
    )
}

export default App