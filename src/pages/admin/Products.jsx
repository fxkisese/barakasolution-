import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import Field from "@/components/admin/Field";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/siteData";

const empty = { name: "", category: "", price: "", stock: 0, in_stock: true, image_url: "", description: "" };

const extractStoragePath = (imageUrl) => {
    if (!imageUrl) return null;

    try {
        const pathname = decodeURIComponent(new URL(imageUrl).pathname);
        const storagePrefix = "/storage/v1/object/public/images/";
        if (pathname.startsWith(storagePrefix)) {
            return pathname.slice(storagePrefix.length);
        }
    } catch {
        return null;
    }

    return null;
};

export default function Products() {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [uploading, setUploading] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const visibleIds = items.map((p) => String(p.id));
    const selectedCount = selectedIds.size;
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));

    const clearSelection = () => setSelectedIds(new Set());

    const load = async () => {
        setLoading(true);
        try {
            const [{ data: prods = [] }, { data: categories = [] }] = await Promise.all([
                supabase.from("products").select("*").order("created_at", { ascending: false }).limit(200),
                supabase.from("categories").select("*").order("created_at", { ascending: false }).limit(100),
            ]);
            setItems(prods || []);
            setCats(categories || []);
            clearSelection();
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(empty); setEditing({ new: true }); };
    const openEdit = (p) => { setForm({ ...p, price: p.price ?? "" }); setEditing({ new: false, id: p.id }); };

    const toggleRowSelection = (id) => {
        const key = String(id);
        setSelectedIds((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleSelectAllVisible = () => {
        const nextVisible = visibleIds;
        setSelectedIds((current) => {
            const next = new Set(current);
            const allSelected = nextVisible.every((id) => next.has(id));

            if (allSelected) {
                nextVisible.forEach((id) => next.delete(id));
            } else {
                nextVisible.forEach((id) => next.add(id));
            }

            return next;
        });
    };

    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `products/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            setForm((f) => ({ ...f, image_url: data.publicUrl }));
        } catch (err) {
            toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const save = async () => {
        if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
        const payload = {
            ...form,
            price: Number(form.price) || 0,
            stock: Number(form.stock) || 0,
            in_stock: !!form.in_stock,
        };
        let error;
        if (editing.new) {
            ({ error } = await supabase.from("products").insert(payload));
        } else {
            ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
        }
        if (error) { toast({ title: "Failed to save", description: error.message, variant: "destructive" }); return; }
        toast({ title: "Product saved" });
        setEditing(null);
        load();
    };

    const remove = async (p) => {
        if (!confirm("Delete this product?")) return;
        await supabase.from("products").delete().eq("id", p.id);
        toast({ title: "Product deleted" });
        load();
    };

    const handleBulkDelete = async () => {
        if (selectedCount === 0) return;

        const ids = Array.from(selectedIds);
        const productsToDelete = items.filter((p) => ids.includes(String(p.id)));
        const imagePaths = productsToDelete
            .map((p) => extractStoragePath(p.image_url))
            .filter(Boolean);

        setBulkDeleting(true);

        try {
            if (imagePaths.length > 0) {
                for (let i = 0; i < imagePaths.length; i += 50) {
                    const chunk = imagePaths.slice(i, i + 50);
                    const { error: storageError } = await supabase.storage.from("images").remove(chunk);
                    if (storageError) throw storageError;
                }
            }

            for (let i = 0; i < ids.length; i += 50) {
                const chunk = ids.slice(i, i + 50);
                const { error } = await supabase.from("products").delete().in("id", chunk);
                if (error) throw error;
            }

            setItems((current) => current.filter((p) => !ids.includes(String(p.id))));
            clearSelection();
            setBulkDeleteOpen(false);
            toast({ title: `${ids.length} products deleted` });
        } catch (error) {
            toast({ title: "Failed to delete products", description: error.message, variant: "destructive" });
        } finally {
            setBulkDeleting(false);
        }
    };

    const quickStock = async (p, stock) => {
        const v = Number(stock) || 0;
        await supabase.from("products").update({ stock: v, in_stock: v > 0 }).eq("id", p.id);
        setItems((arr) => arr.map((x) => (x.id === p.id ? { ...x, stock: v, in_stock: v > 0 } : x)));
    };

    const toggleStock = async (p) => {
        const in_stock = !p.in_stock;
        await supabase.from("products").update({ in_stock }).eq("id", p.id);
        setItems((arr) => arr.map((x) => (x.id === p.id ? { ...x, in_stock } : x)));
    };

    return (
        <div className="p-8">
            <AdminPageHeader
                title="Products"
                subtitle="Manage inventory and stock availability"
                action={
                    <Button onClick={openNew} className="bg-[#1A1A1A] text-white hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                }
            />

            {selectedCount > 0 && (
                <div className="sticky top-3 z-10 mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-[#1A1A1A]">{selectedCount} selected</div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkDeleteOpen(true)}
                            disabled={bulkDeleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {bulkDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete selected
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={clearSelection} disabled={bulkDeleting}>
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-white border border-[#EAEBED] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[840px] text-sm">
                        <thead className="bg-[#FAFAFB] text-left text-[#5F6368] text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-3 py-3 w-12">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={toggleSelectAllVisible}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = someVisibleSelected && !allVisibleSelected;
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-[#D0D5DD] text-[#1A1A1A] focus:ring-[#1A1A1A]"
                                        aria-label="Select all products"
                                    />
                                </th>
                                <th className="px-5 py-3 font-medium">Product</th>
                                <th className="px-5 py-3 font-medium">Category</th>
                                <th className="px-5 py-3 font-medium">Price</th>
                                <th className="px-5 py-3 font-medium">Stock</th>
                                <th className="px-5 py-3 font-medium">In stock</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAEBED]">
                            {loading && (
                                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#5F6368]">Loading…</td></tr>
                            )}
                            {!loading && items.length === 0 && (
                                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#5F6368]">No products yet.</td></tr>
                            )}
                            {items.map((p) => {
                                const isSelected = selectedIds.has(String(p.id));
                                return (
                                    <tr key={p.id} className={isSelected ? "bg-[#F5F8F1] hover:bg-[#EEF5EA]" : "hover:bg-[#FAFAFB]"}>
                                        <td className="px-3 py-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleRowSelection(p.id);
                                                }}
                                                className="h-4 w-4 rounded border-[#D0D5DD] text-[#1A1A1A] focus:ring-[#1A1A1A]"
                                                aria-label={`Select ${p.name}`}
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? (
                                                    <Image src={p.image_url} alt={p.name} className="w-10 h-10 rounded-md object-cover" fittingType="fill" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-[#F0F1F3]" />
                                                )}
                                                <span className="font-medium text-[#1A1A1A]">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-[#5F6368]">{p.category || "—"}</td>
                                        <td className="px-5 py-3 text-[#1A1A1A]">{formatPrice(p.price || 0)}</td>
                                        <td className="px-5 py-3">
                                            <input
                                                type="number"
                                                defaultValue={p.stock || 0}
                                                onBlur={(e) => quickStock(p, e.target.value)}
                                                className="w-20 h-9 px-2 border border-[#EAEBED] rounded-md text-sm focus:outline-none focus:border-[#1A1A1A]"
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleStock(p)}
                                                className={`px-3 py-1 rounded-full text-xs ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {p.in_stock ? "Available" : "Out"}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="inline-flex gap-2">
                                                <button type="button" onClick={() => openEdit(p)} className="text-[#5F6368] hover:text-[#1A1A1A]">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button type="button" onClick={() => remove(p)} className="text-[#5F6368] hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal open={bulkDeleteOpen} onClose={() => !bulkDeleting && setBulkDeleteOpen(false)} title={`Delete ${selectedCount} products?`}>
                <div className="space-y-4">
                    <p className="text-sm text-[#5F6368]">This cannot be undone.</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setBulkDeleteOpen(false)} disabled={bulkDeleting}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {bulkDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete selected
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.new ? "Add product" : "Edit product"}>
                <div className="space-y-4">
                    <Field label="Name">
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Category">
                            <input
                                list="cats"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full h-10 px-3 border border-[#EAEBED] rounded-md text-sm focus:outline-none focus:border-[#1A1A1A]"
                            />
                            <datalist id="cats">
                                {cats.map((c) => <option key={c.id} value={c.name} />)}
                            </datalist>
                        </Field>
                        <Field label="Price (KES)">
                            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Stock">
                        <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                    </Field>
                    <Field label="Image">
                        <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#EAEBED] text-sm cursor-pointer hover:border-[#1A1A1A]">
                                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
                                <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                            </label>
                            {form.image_url && (
                                <Image src={form.image_url} alt="" className="w-14 h-14 rounded-md object-cover" fittingType="fill" />
                            )}
                        </div>
                    </Field>
                    <Field label="Description">
                        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                    </Field>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button onClick={save} className="bg-[#1A1A1A] text-white hover:opacity-90">Save</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
        </div>
    );
}