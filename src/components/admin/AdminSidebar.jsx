import { NavLink, Link } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    Package,
    Tags,
    Banknote,
    CreditCard,
    Receipt,
    BarChart3,
    MessageSquare,
    FileText,
    Image as ImageIcon,
} from "lucide-react";

const NAV = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tags },
    { to: "/admin/sales", label: "Sales", icon: Banknote },
    { to: "/admin/credit-book", label: "Credit Book", icon: CreditCard },
    { to: "/admin/expenses", label: "Expenses", icon: Receipt },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    { to: "/admin/quotes", label: "Quotes", icon: FileText },
    { to: "/admin/hero-slides", label: "Hero Slides", icon: ImageIcon },
];

export default function AdminSidebar() {
    return (
        <aside className="w-64 shrink-0 bg-white border-r border-[#EAEBED] sticky top-0 h-screen overflow-y-auto">
            <div className="px-6 h-20 flex items-center border-b border-[#EAEBED]">
                <Link to="/admin" className="font-heading text-xl tracking-[0.12em] uppercase text-[#1A1A1A]">
                    Luxe Craft Admin
                </Link>
            </div>
            <nav className="p-3 flex flex-col gap-1">
                {NAV.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                                ? "bg-[#FDF5E6] text-[#B8902A] font-semibold"
                                : "text-[#5F6368] hover:bg-[#F5F6F8]"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[#D4AF37]" />
                                )}
                                <Icon className="w-5 h-5" strokeWidth={1.6} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}