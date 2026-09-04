import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, Video, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Modal from "@/components/admin/Modal";
import Field from "@/components/admin/Field";
import { Image } from "@/components/ui/image";

const empty = {
    title: "",
    subtitle: "",
    image_url: "",
    video_url: "",
    cta_label: "Discover",
    active: true,
    order: 0,
};

/** Returns true if the string looks like a video URL */
function isVideoUrl(url) {
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "");
}

export default function HeroSlides() {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

    const load = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("hero_slides")
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
    const openEdit = (s) => { setForm({ ...s, video_url: s.video_url || "" }); setEditing({ new: false, id: s.id }); };

    /* ── Image upload ── */
    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `hero-slides/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            setForm((s) => ({ ...s, image_url: data.publicUrl }));
            toast({ title: "Image uploaded ✓" });
        } catch (err) {
            toast({ title: "Image upload failed", description: err.message, variant: "destructive" });
        } finally {
            setUploadingImage(false);
        }
    };

    /* ── Video upload ── */
    const uploadVideo = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Warn for large files
        const sizeMB = file.size / 1024 / 1024;
        if (sizeMB > 100) {
            toast({ title: "File too large", description: "Please use a video under 100 MB. Compress it first for best performance.", variant: "destructive" });
            return;
        }

        setUploadingVideo(true);
        setVideoProgress(0);
        try {
            const ext = file.name.split(".").pop();
            const path = `hero-videos/${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(path, file, {
                contentType: file.type,
                upsert: false,
            });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("images").getPublicUrl(path);
            setForm((s) => ({ ...s, video_url: data.publicUrl }));
            toast({ title: "Video uploaded ✓" });
        } catch (err) {
            toast({ title: "Video upload failed", description: err.message, variant: "destructive" });
        } finally {
            setUploadingVideo(false);
            setVideoProgress(0);
        }
    };

    const save = async () => {
        if (!form.image_url && !form.video_url) {
            toast({ title: "Please add an image or video", variant: "destructive" });
            return;
        }
        const payload = {
            ...form,
            order: Number(form.order) || 0,
            active: !!form.active,
            video_url: form.video_url || null,
        };
        let error;
        if (editing.new) {
            ({ error } = await supabase.from("hero_slides").insert(payload));
        } else {
            ({ error } = await supabase.from("hero_slides").update(payload).eq("id", editing.id));
        }
        if (error) {
            toast({ title: "Failed to save", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Slide saved ✓" });
        setEditing(null);
        load();
    };

    const remove = async (s) => {
        if (!confirm("Delete this slide?")) return;
        await supabase.from("hero_slides").delete().eq("id", s.id);
        toast({ title: "Slide deleted" });
        load();
    };

    const toggleActive = async (s) => {
        const active = !s.active;
        await supabase.from("hero_slides").update({ active }).eq("id", s.id);
        setItems((arr) => arr.map((x) => (x.id === s.id ? { ...x, active } : x)));
    };

    return (
        <div className="p-8">
            <AdminPageHeader
                title="Hero Slides"
                subtitle="Upload and manage hero imagery and videos on the homepage"
                action={
                    <Button onClick={openNew} className="bg-[#1A1A1A] text-white hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Add Slide
                    </Button>
                }
            />

            <div className="mt-6 space-y-4">
                {loading && <div className="text-center text-[#5F6368] py-10">Loading…</div>}
                {!loading && items.length === 0 && (
                    <div className="text-center text-[#5F6368] py-10">No slides yet. Add one to feature on the homepage.</div>
                )}
                {items.map((s) => {
                    const hasVideo = !!s.video_url;
                    return (
                        <div
                            key={s.id}
                            className="flex flex-col md:flex-row gap-4 bg-white border border-[#EAEBED] rounded-xl overflow-hidden"
                        >
                            {/* Thumbnail / Video preview */}
                            <div className="md:w-64 aspect-video bg-[#F0F1F3] shrink-0 relative">
                                {hasVideo ? (
                                    <>
                                        <video
                                            src={s.video_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            preload="metadata"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="flex items-center gap-1.5 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                                                <Video className="w-3 h-3" />
                                                Video Slide
                                            </div>
                                        </div>
                                    </>
                                ) : s.image_url ? (
                                    <Image src={s.image_url} alt={s.title} className="w-full h-full" fittingType="fill" />
                                ) : null}
                            </div>

                            {/* Info */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-heading text-xl text-[#1A1A1A]">{s.title || <span className="text-gray-400 italic">No title</span>}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {s.active ? "Active" : "Hidden"}
                                        </span>
                                        {hasVideo && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 flex items-center gap-1">
                                                <Video className="w-3 h-3" /> Video
                                            </span>
                                        )}
                                    </div>
                                    {s.subtitle && <p className="text-sm text-[#5F6368] mt-1">{s.subtitle}</p>}
                                    <p className="text-xs text-[#5F6368] mt-1">
                                        CTA: {s.cta_label || "—"} · Order {s.order || 0}
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
                    );
                })}
            </div>

            <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.new ? "Add slide" : "Edit slide"}>
                <div className="space-y-5">
                    <Field label="Title (Optional)">
                        <Input placeholder="e.g. Durable. Stylish." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </Field>
                    <Field label="Subtitle (Optional)">
                        <Input placeholder="e.g. Discover the perfect design" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                    </Field>

                    {/* ── VIDEO UPLOAD ── */}
                    <Field label="Background Video (MP4 · WebM)">
                        <div className="space-y-3">
                            <label className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border text-sm cursor-pointer transition-colors ${uploadingVideo ? 'border-purple-300 text-purple-500' : 'border-[#EAEBED] hover:border-purple-400 text-[#1A1A1A]'}`}>
                                <Video className="w-4 h-4" />
                                {uploadingVideo ? "Uploading video… please wait" : "Upload video from computer"}
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                    className="hidden"
                                    onChange={uploadVideo}
                                    disabled={uploadingVideo}
                                />
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Or paste a video URL (.mp4, .webm)…"
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    className="text-sm"
                                />
                            </div>
                            {form.video_url && (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <Video className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span className="text-xs text-purple-700 font-medium truncate flex-1">{form.video_url}</span>
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, video_url: "" }))}
                                        className="text-purple-400 hover:text-red-500 text-lg leading-none"
                                        title="Remove video"
                                    >×</button>
                                </div>
                            )}
                            <p className="text-xs text-[#5F6368]">
                                💡 Video plays as a cinematic fullscreen background (muted, looping). Recommended: MP4 under 30 MB for fast loading.
                            </p>
                        </div>
                    </Field>

                    {/* ── IMAGE (fallback or standalone) ── */}
                    <Field label="Background Image">
                        <div className="space-y-3">
                            <label className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border text-sm cursor-pointer transition-colors ${uploadingImage ? 'border-[#D4AF37]/50 text-[#D4AF37]' : 'border-[#EAEBED] hover:border-[#1A1A1A]'}`}>
                                <Upload className="w-4 h-4" />
                                {uploadingImage ? "Uploading…" : "Upload image from computer"}
                                <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploadingImage} />
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Or paste an image URL…"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    className="text-sm"
                                />
                            </div>
                            {form.image_url && (
                                <div className="flex items-center gap-3 mt-1">
                                    <Image src={form.image_url} alt="Preview" className="w-32 h-20 rounded-md object-cover border border-[#EAEBED]" fittingType="fill" />
                                    <span className="text-xs text-green-600 font-medium">✓ Image ready</span>
                                </div>
                            )}
                            {form.video_url && (
                                <p className="text-xs text-[#5F6368]">
                                    ℹ️ When a video is set, the image is used as a poster/fallback if the video fails to load.
                                </p>
                            )}
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="CTA label">
                            <Input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
                        </Field>
                        <Field label="Display order">
                            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                        </Field>
                    </div>

                    <Field label="Active">
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                            />
                            Show on homepage
                        </label>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button onClick={save} className="bg-[#1A1A1A] text-white hover:opacity-90" disabled={uploadingVideo || uploadingImage}>
                            Save Slide
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}