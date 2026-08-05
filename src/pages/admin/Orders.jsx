import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import { formatPrice } from "@/lib/siteData";

const STATUSES = ["new", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [view, setView] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);
            if (error) throw error;
            setOrders(data || []);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        const { error } = await supabase.from("orders").update({ status }).eq("id", id);
        if (error) { toast({ title: "Failed to update", variant: "destructive" }); return; }
        toast({ title: "Order updated" });
        setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
        if (view?.id === id) setView((v) => ({ ...v, status }));
    };

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
    const newCount = orders.filter((o) => o.status === "new").length;

    const chip = (active) =>
        `h-9 px-4 rounded-full text-xs uppercase tracking-wide capitalize border transition-colors ${active
            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
            : "bg-white text-[#5F6368] border-[#EAEBED] hover:border-[#1A1A1A]"
        }`;

    return (
        <div className="p-8">
            <AdminPageHeader
                title="Orders"
                subtitle={`${newCount} new order${newCount === 1 ? "" : "s"} awaiting review`}
            />

            <div className="mt-6 flex flex-wrap gap-2">
                {["all", ...STATUSES].map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={chip(filter === s)}>
                        {s}
                    </button>
                ))}
            </div>

            <div className="mt-6 bg-white border border-[#EAEBED] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFB] text-left text-[#5F6368] text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Items</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEBED]">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-5 py-10 text-center text-[#5F6368]">Loading…</td>
                            </tr>
                        )}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-10 text-center text-[#5F6368]">No orders found.</td>
                            </tr>
                        )}
                        {filtered.map((o) => (
                            <tr key={o.id} className="hover:bg-[#FAFAFB]">
                                <td className="px-5 py-3">
                                    <p className="font-medium text-[#1A1A1A]">{o.customer_name}</p>
                                    <p className="text-xs text-[#5F6368]">{o.customer_email || "—"}</p>
                                </td>
                                <td className="px-5 py-3 text-[#5F6368]">
                                    {o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}
                                </td>
                                <td className="px-5 py-3 text-[#5F6368]">{o.items?.length || 0}</td>
                                <td className="px-5 py-3 font-medium text-[#1A1A1A]">{formatPrice(o.total || 0)}</td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${o.status === "new"
                                            ? "bg-[#FDF5E6] text-[#B8902A] font-semibold"
                                            : "bg-[#F0F1F3] text-[#5F6368]"
                                        }`}
                                    >
                                        {o.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <button onClick={() => setView(o)} className="text-[#5F6368] hover:text-[#1A1A1A]">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!view} onClose={() => setView(null)} title="Order details">
                {view && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-[#5F6368] uppercase tracking-wide">Customer</p>
                            <p className="font-medium">{view.customer_name}</p>
                            <p className="text-sm text-[#5F6368]">{view.customer_email || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#5F6368] uppercase tracking-wide mb-2">Items</p>
                            <ul className="divide-y divide-[#EAEBED] border border-[#EAEBED] rounded-lg">
                                {(view.items || []).map((it, i) => (
                                    <li key={i} className="flex justify-between px-3 py-2 text-sm">
                                        <span>{it.name} × {it.quantity}</span>
                                        <span className="text-[#5F6368]">{formatPrice((it.price || 0) * (it.quantity || 1))}</span>
                                    </li>
                                ))}
                                {(!view.items || view.items.length === 0) && (
                                    <li className="px-3 py-2 text-sm text-[#5F6368]">No items recorded.</li>
                                )}
                            </ul>
                            <p className="text-right mt-2 text-sm">
                                Total: <span className="font-semibold">{formatPrice(view.total || 0)}</span>
                            </p>
                        </div>
                        {view.notes && <p className="text-sm text-[#5F6368]">Notes: {view.notes}</p>}
                        <div>
                            <p className="text-xs text-[#5F6368] uppercase tracking-wide">Update status</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {STATUSES.map((s) => (
                                    <button key={s} onClick={() => updateStatus(view.id, s)} className={chip(view.status === s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}