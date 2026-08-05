import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ClipboardList, AlertTriangle, Tags } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { formatPrice } from "@/lib/siteData";

export default function Dashboard() {
    const [stats, setStats] = useState({
        newOrders: 0,
        products: 0,
        lowStock: [],
        categories: 0,
        recent: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [
                    { data: orders = [] },
                    { data: products = [] },
                    { data: categories = [] },
                ] = await Promise.all([
                    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
                    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(200),
                    supabase.from("categories").select("*").order("created_at", { ascending: false }).limit(100),
                ]);
                setStats({
                    newOrders: (orders || []).filter((o) => o.status === "new").length,
                    products: (products || []).length,
                    lowStock: (products || []).filter((p) => (p.stock || 0) <= 5),
                    categories: (categories || []).length,
                    recent: (orders || []).slice(0, 5),
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const cards = [
        { label: "New Orders", value: stats.newOrders, icon: ClipboardList, to: "/admin/orders", accent: "#D4AF37" },
        { label: "Products", value: stats.products, icon: Package, to: "/admin/products", accent: "#1A1A1A" },
        { label: "Low Stock", value: stats.lowStock.length, icon: AlertTriangle, to: "/admin/products", accent: "#E0A800" },
        { label: "Categories", value: stats.categories, icon: Tags, to: "/admin/categories", accent: "#1A1A1A" },
    ];

    return (
        <div className="p-8">
            <AdminPageHeader title="Dashboard" subtitle="Overview of store activity" />
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => (
                    <Link
                        key={c.label}
                        to={c.to}
                        className="bg-white border border-[#EAEBED] rounded-xl p-5 hover:border-[#1A1A1A] transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <c.icon className="w-6 h-6" style={{ color: c.accent }} strokeWidth={1.5} />
                            <span className="text-2xl font-heading text-[#1A1A1A]">{loading ? "—" : c.value}</span>
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-wide text-[#5F6368]">{c.label}</p>
                    </Link>
                ))}
            </div>

            <div className="mt-8 grid lg:grid-cols-2 gap-4">
                <div className="bg-white border border-[#EAEBED] rounded-xl p-5">
                    <h3 className="font-medium text-[#1A1A1A] mb-3">Recent Orders</h3>
                    {stats.recent.length === 0 ? (
                        <p className="text-sm text-[#5F6368]">No orders yet.</p>
                    ) : (
                        <ul className="divide-y divide-[#EAEBED]">
                            {stats.recent.map((o) => (
                                <li key={o.id} className="flex justify-between py-2 text-sm">
                                    <span className="text-[#1A1A1A]">{o.customer_name}</span>
                                    <span className="text-[#5F6368]">{formatPrice(o.total || 0)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="bg-white border border-[#EAEBED] rounded-xl p-5">
                    <h3 className="font-medium text-[#1A1A1A] mb-3">Low Stock Alerts</h3>
                    {stats.lowStock.length === 0 ? (
                        <p className="text-sm text-[#5F6368]">All products well stocked.</p>
                    ) : (
                        <ul className="divide-y divide-[#EAEBED]">
                            {stats.lowStock.map((p) => (
                                <li key={p.id} className="flex justify-between py-2 text-sm">
                                    <span className="text-[#1A1A1A]">{p.name}</span>
                                    <span className="text-red-600">{p.stock || 0} left</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}