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

const empty = { image_url: "", active: true, order: 0 };

export default function AboutSlides() {
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
                .from("about_slides")
                .select("*")
                .order("order", { ascending: true })
                .limit(100);
            if (error) throw error;
            setItems(data || []);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(empty); setEditing({ new: true }); };
    const openEdit = (s) => { setForm({ ...s }); setEditing({ new: false, id: s.id }); };

    const upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `about-slides/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            setForm((s) => ({ ...s, image_url: data.publicUrl }));
        } catch (err) {
            toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const save = async () => {
        if (!form.image_url) {
            toast({ title: "Image is required", variant: "destructive" });
            return;
        }
        const payload = { ...form, order: Number(form.order) || 0, active: !!form.active };
        let error;
        if (editing.new) {
            ({ error } = await supabase.from("about_slides").insert(payload));
        } else {
            ({ error } = await supabase.from("about_slides").update(payload).eq("id", editing.id));
        }
        if (error) { toast({ title: "Failed to save", description: error.message, variant: "destructive" }); return; }
        toast({ title: "Slide saved" });
        setEditing(null);
        load();
    };

    const remove = async (s) => {
        if (!confirm("Delete this slide?")) return;
        await supabase.from("about_slides").delete().eq("id", s.id);
        toast({ title: "Slide deleted" });
        load();
    };

    const toggleActive = async (s) => {
        const active = !s.active;
        await supabase.from("about_slides").update({ active }).eq("id", s.id);
        setItems((arr) => arr.map((x) => (x.id === s.id ? { ...x, active } : x)));
    };

    return (
        <div className="p-8">
            <AdminPageHeader
                title="About Slides"
                subtitle="Upload and manage slideshow images for the About Us page"
                action={
                    <Button onClick={openNew} className="bg-[#1A1A1A] text-white hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Add Slide
                    </Button>
                }
            />

            <div className="mt-6 space-y-4">
                {loading && <div className="text-center text-[#5F6368] py-10">Loading…</div>}
                {!loading && items.length === 0 && (
                    <div className="text-center text-[#5F6368] py-10">No slides yet. Add one to feature on the About Us page.</div>
                )}
                {items.map((s) => (
                    <div
                        key={s.id}
                        className="flex flex-col md:flex-row gap-4 bg-white border border-[#EAEBED] rounded-xl overflow-hidden"
                    >
                        <div className="md:w-64 aspect-video bg-[#F0F1F3] shrink-0">
                            {s.image_url && <Image src={s.image_url} alt="Slide Preview" className="w-full h-full" fittingType="fill" />}
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {s.active ? "Active" : "Hidden"}
                                    </span>
                                </div>
                                <p className="text-xs text-[#5F6368] mt-2">
                                    Order {s.order || 0}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Button variant="outline" onClick={() => toggleActive(s)}>
                                    {s.active ? "Hide" : "Show"}
                                </Button>
                                <Button variant="outline" onClick={() => openEdit(s)}>
                                    <Pencil className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" onClick={() => remove(s)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.new ? "Add slide" : "Edit slide"}>
                <div className="space-y-4">
                    <Field label="Slide Image">
                        <div className="space-y-3">
                            {/* Option 1: Upload file */}
                            <label className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#EAEBED] text-sm cursor-pointer hover:border-[#1A1A1A]">
                                <Upload className="w-4 h-4" />
                                {uploading ? "Uploading… please wait" : "Upload from computer"}
                                <input type="file" accept="image/*" className="hidden" onChange={upload} />
                            </label>
                            {/* Option 2: Paste URL */}
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Or paste an image URL here…"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    className="text-sm"
                                />
                            </div>
                            {/* Preview */}
                            {form.image_url && (
                                <div className="flex items-center gap-3 mt-1">
                                    <Image src={form.image_url} alt="Preview" className="w-32 h-20 rounded-md object-cover border border-[#EAEBED]" fittingType="fill" />
                                    <span className="text-xs text-green-600 font-medium">✓ Image ready</span>
                                </div>
                            )}
                        </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Display order">
                            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Active">
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                            />
                            Show on About Us page
                        </label>
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
