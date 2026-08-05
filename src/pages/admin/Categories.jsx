import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import Field from "@/components/admin/Field";
import { Image } from "@/components/ui/image";

const empty = { name: "", tag: "", image: "", description: "" };

export default function Categories() {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [uploading, setUploading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);
            if (error) throw error;
            setItems(data || []);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(empty); setEditing({ new: true }); };
    const openEdit = (c) => {
        setForm({ name: c.name, tag: c.tag || "", image: c.image || "", description: c.description || "" });
        setEditing({ new: false, id: c.id });
    };

    const upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `categories/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            setForm((s) => ({ ...s, image: data.publicUrl }));
        } catch (err) {
            toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const save = async () => {
        if (!form.name) { toast({ title: "Name required", variant: "destructive" }); return; }
        let error;
        if (editing.new) {
            ({ error } = await supabase.from("categories").insert(form));
        } else {
            ({ error } = await supabase.from("categories").update(form).eq("id", editing.id));
        }
        if (error) { toast({ title: "Failed to save", description: error.message, variant: "destructive" }); return; }
        toast({ title: "Category saved" });
        setEditing(null);
        load();
    };

    const remove = async (c) => {
        if (!confirm("Delete this category?")) return;
        await supabase.from("categories").delete().eq("id", c.id);
        toast({ title: "Category deleted" });
        load();
    };

    return (
        <div className="p-8">
            <AdminPageHeader
                title="Categories"
                subtitle="Organise your storefront collections"
                action={
                    <Button onClick={openNew} className="bg-[#1A1A1A] text-white hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                }
            />

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading && <div className="col-span-full text-center text-[#5F6368] py-10">Loading…</div>}
                {!loading && items.length === 0 && (
                    <div className="col-span-full text-center text-[#5F6368] py-10">No categories yet.</div>
                )}
                {items.map((c) => (
                    <div key={c.id} className="bg-white border border-[#EAEBED] rounded-xl overflow-hidden group">
                        <div className="relative aspect-[4/3] bg-[#F0F1F3]">
                            {c.image ? (
                                <Image src={c.image} alt={c.name} className="w-full h-full" fittingType="fill" />
                            ) : (
                                <div className="w-full h-full" />
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(c)}
                                    className="w-8 h-8 grid place-items-center bg-white/90 rounded-md text-[#5F6368] hover:text-[#1A1A1A]"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => remove(c)}
                                    className="w-8 h-8 grid place-items-center bg-white/90 rounded-md text-[#5F6368] hover:text-red-600"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-medium text-[#1A1A1A]">{c.name}</p>
                            {c.tag && <p className="text-xs text-[#5F6368] uppercase tracking-wide mt-0.5">{c.tag}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.new ? "Add category" : "Edit category"}>
                <div className="space-y-4">
                    <Field label="Name">
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label="Tag">
                        <Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Seating" />
                    </Field>
                    <Field label="Image">
                        <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#EAEBED] text-sm cursor-pointer hover:border-[#1A1A1A]">
                                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
                                <input type="file" accept="image/*" className="hidden" onChange={upload} />
                            </label>
                            {form.image && (
                                <Image src={form.image} alt="" className="w-14 h-14 rounded-md object-cover" fittingType="fill" />
                            )}
                        </div>
                    </Field>
                    <Field label="Description">
                        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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