import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import {
    sendOrderToAdminWhatsApp,
    sendCreditReminderWhatsApp,
    sendNewCreditReceiptWhatsApp,
    sendSaleReceiptWhatsApp,
} from '@/utils/whatsapp';
import Cropper from 'react-easy-crop';
import InquiriesPage from '@/components/admin/InquiriesPage';

/* ---------- Constants ---------- */
const CATEGORIES = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Storage', 'Combo Items'];
const SUBCATEGORIES = {
    'Living Room': ['Sofas', 'Coffee Tables', 'TV Stands'],
    'Bedroom': ['Beds', 'Wardrobes', 'Dressers'],
    'Dining': ['Dining Sets', 'Sideboards'],
    'Office': ['Executive Desks', 'Office Chairs', 'Cabinets', 'Reception Desk'],
    'Storage': ['Shelving Units', 'Shoe Racks', 'Storage Cabinets'],
    'Combo Items': ['Living Room Combos', 'Bedroom Combos', 'Dining Combos', 'Office Combos'],
};

/* ---------- Design tokens ---------- */
const COLORS = {
    // Sidebar (deep dark)
    sidebar: '#0f0e0d',
    sidebarBorder: 'rgba(255,255,255,0.07)',
    sidebarText: 'rgba(255,255,255,0.55)',
    sidebarActive: 'rgba(212,175,55,0.15)',
    sidebarActiveText: '#D4AF37',
    // Content area
    bg: '#f7f6f4',
    surface: '#ffffff',
    surface2: '#f0efed',
    surface3: '#e8e6e1',
    border: '#e4e2dd',
    text: '#1a1816',
    muted: '#7c7568',
    // Accent
    gold: '#C9A84C',
    goldBright: '#D4AF37',
    goldSoft: 'rgba(201,168,76,0.12)',
    goldGlow: 'rgba(201,168,76,0.25)',
    // Status
    green: '#059669',
    greenSoft: 'rgba(5,150,105,0.1)',
    amber: '#d97706',
    amberSoft: 'rgba(217,119,6,0.1)',
    rust: '#dc2626',
    rustSoft: 'rgba(220,38,38,0.1)',
};
const fontDisplay = "'Inter', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";
const BRANCHES = ['Nairobi', 'Mombasa'];
const TODAY = new Date().toISOString().split('T')[0];
const fmt = (n) => `KSh ${Number(n || 0).toLocaleString()}`;
const TRANSPORT_METHODS = ['Truck', 'Pickup Van', 'Courier', 'Manual Arrangement'];
const DELIVERY_REGIONS = ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri'];

/* ---------- Inline SVG icons ---------- */
const ic = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconGauge = (p) => <svg {...ic} {...p}><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16 16 10" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg>;
const IconBox = (p) => <svg {...ic} {...p}><path d="M12 3 21 7.5 21 16.5 12 21 3 16.5 3 7.5Z" /><path d="M3 7.5 12 12 21 7.5" /><path d="M12 12 12 21" /></svg>;
const IconBanknote = (p) => <svg {...ic} {...p}><rect x="2" y="6" width="20" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9h.01M18 15h.01" /></svg>;
const IconCard = (p) => <svg {...ic} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></svg>;
const IconReceipt = (p) => <svg {...ic} {...p}><path d="M5 3h14v18l-2-1.5L15 21l-2-1.5L11 21l-2-1.5L7 21l-2-1.5Z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>;
const IconChart = (p) => <svg {...ic} {...p}><rect x="4" y="11" width="3.5" height="9" /><rect x="10.25" y="6" width="3.5" height="14" /><rect x="16.5" y="14" width="3.5" height="6" /></svg>;
const IconChat = (p) => <svg {...ic} {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-3.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 11.6 4 8.4 8.4 0 0 1 21 11.5Z" /></svg>;
const IconLogout = (p) => <svg {...ic} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17 21 12 16 7" /><path d="M21 12H9" /></svg>;
const IconPlus = (p) => <svg {...ic} {...p}><path d="M12 5v14M5 12h14" /></svg>;
const IconImage = (p) => <svg {...ic} {...p}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const IconSearch = (p) => <svg {...ic} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21 16.7 16.7" /></svg>;
const IconTrash = (p) => <svg {...ic} {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6h12Z" /></svg>;
const IconEdit = (p) => <svg {...ic} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconMenu = (p) => <svg {...ic} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconX = (p) => <svg {...ic} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
const IconWhatsApp = (p) => <svg {...ic} {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.417A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 0 1-4.073-1.117l-.292-.173-3.03.863.877-3.04-.19-.312A7.944 7.944 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" /></svg>;

/* ---------- Logo ---------- */
function LogoMark() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32">
            <rect x="2" y="2" width="12" height="28" rx="1" fill={COLORS.goldBright} />
            <rect x="16" y="2" width="7" height="11" rx="1" fill="rgba(255,255,255,0.9)" />
            <rect x="16" y="19" width="7" height="11" rx="1" fill="rgba(255,255,255,0.9)" />
        </svg>
    );
}

/* ---------- Shared styles ---------- */
const inputStyle = { width: '100%', background: '#faf9f7', border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: '10px 14px', color: COLORS.text, fontFamily: fontBody, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const labelStyle = { display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 7, fontWeight: 700 };
const cardStyle = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04)' };
const thStyle = { textAlign: 'left', padding: '13px 18px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.muted, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}`, whiteSpace: 'nowrap', background: COLORS.surface2 };
const tdStyle = { padding: '15px 18px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 14, verticalAlign: 'middle' };
const sectionTitleStyle = { fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 12 };
const rowItemStyle = { padding: '13px 18px', borderBottom: `1px solid ${COLORS.border}` };
const btnPrimary = { background: `linear-gradient(135deg, ${COLORS.goldBright}, ${COLORS.gold})`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: fontBody, boxShadow: `0 2px 8px ${COLORS.goldGlow}`, letterSpacing: '0.01em' };
const btnSecondary = { background: COLORS.surface, color: COLORS.text, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: '10px 22px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: fontBody };
const btnDanger = { background: COLORS.rustSoft, color: COLORS.rust, border: `1.5px solid ${COLORS.rust}44`, borderRadius: 10, padding: '10px 22px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: fontBody };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: '6px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', transition: 'background 0.15s, color 0.15s' };

/* ---------- Utility hook ---------- */
function useForm(initial) {
    const [values, setValues] = useState(initial);
    const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    return [values, set, setValues];
}

/* ---------- Small building blocks ---------- */
function Badge({ children, color }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: fontMono, letterSpacing: '0.06em', textTransform: 'uppercase', color, background: color + '18', fontWeight: 600 }}>
            {children}
        </span>
    );
}

function PageHeader({ eyebrow, title, action = null }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28, padding: '4px 0 20px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div>
                <div style={{ fontSize: 11, letterSpacing: '0.18em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: 5, fontWeight: 700 }}>{eyebrow}</div>
                <h1 style={{ fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: COLORS.text, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
            </div>
            {action && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{action}</div>}
        </div>
    );
}

function StatCard({ label, value, sub, accent, onClick }) {
    return (
        <div onClick={onClick} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '20px 22px', cursor: onClick ? 'pointer' : 'default', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88)`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 10, fontWeight: 700 }}>{label}</div>
            <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 600, color: COLORS.text, letterSpacing: '-0.02em' }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{sub}</div>}
        </div>
    );
}

function EmptyRow({ text }) {
    return (
        <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◇</div>
            <div style={{ color: COLORS.muted, fontSize: 13, fontWeight: 500 }}>{text}</div>
        </div>
    );
}

function Modal({ title, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,8,6,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 16 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.surface, borderRadius: 20, padding: '32px', width: '100%', maxWidth: 660, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 18, borderBottom: `1px solid ${COLORS.border}` }}>
                    <h3 style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0, letterSpacing: '-0.02em' }}>{title}</h3>
                    <button onClick={onClose} style={{ ...iconBtnStyle, background: COLORS.surface2, borderRadius: 8, padding: 8 }} aria-label="Close"><IconX /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

/* ---------- Image Cropper ---------- */
function ImageCropperModal({ file, onApply, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        let objectUrl = null;
        if (typeof file === 'string') { 
            setImageSrc(file); 
        } else if (file instanceof Blob || file instanceof File) {
            objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    if (!imageSrc) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
                <Cropper 
                    image={imageSrc} 
                    crop={crop} 
                    zoom={zoom} 
                    aspect={aspect} 
                    onCropChange={setCrop} 
                    onCropComplete={(_, pix) => setCroppedAreaPixels(pix)} 
                    onZoomChange={setZoom} 
                />
            </div>
            <div style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Ratio:</span>
                        <select 
                            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} 
                            value={aspect} 
                            onChange={e => setAspect(Number(e.target.value))}
                        >
                            <option value={1}>Square (1:1)</option>
                            <option value={4/5}>Portrait (4:5)</option>
                            <option value={3/4}>Portrait (3:4)</option>
                            <option value={16/9}>Landscape (16:9)</option>
                            <option value={3/2}>Landscape (3:2)</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Zoom:</span>
                        <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: 120 }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" style={btnSecondary} onClick={onCancel}>Skip / Cancel</button>
                    <button type="button" style={btnPrimary} onClick={() => onApply(croppedAreaPixels)}>Apply Crop</button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Forms ---------- */
function ProductForm({ onSubmit, onCancel, initialData = null }) {
    let initMeta = {}, initOutside = {};
    try {
        const parsed = JSON.parse(initialData?.delivery_outside || '{}') || {};
        if (parsed.metadata) { initMeta = parsed.metadata; const { metadata: _m, ...rest } = parsed; initOutside = rest; }
        else { initOutside = parsed; }
    } catch (_) {}

    const defaultValues = { name: '', category: 'Living Room', subcategory: '', price: '', description: '', in_stock: true, featured: false, image: '', badge: '', rating: 5.0, review_count: 0, delivery_nairobi: '600', transport_method: '', delivery_outside: '{}', size: '', piece_price: '', images: [], combo_items: [] };
    const editValues = initialData ? { ...initialData, size: initMeta.size || initialData.size || '', piece_price: initMeta.piece_price || initialData.piece_price || '', images: (initMeta.images?.length > 0) ? initMeta.images : (initialData.images || []), combo_items: initMeta.combo_items || [] } : defaultValues;

    const [v, set, setValues] = useForm(editValues);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [outsidePrices, setOutsidePrices] = useState(initOutside);
    const [filesToCrop, setFilesToCrop] = useState([]);
    const [currentCropFile, setCurrentCropFile] = useState(null);
    const [editingImageIndex, setEditingImageIndex] = useState(null);

    const handleAddComboItem = () => setValues(prev => ({ ...prev, combo_items: [...(prev.combo_items || []), { name: '', price: '', discount: '' }] }));
    const handleComboChange = (idx, field, val) => setValues(prev => { const arr = [...(prev.combo_items || [])]; arr[idx] = { ...arr[idx], [field]: val }; return { ...prev, combo_items: arr }; });
    const handleRemoveCombo = (idx) => setValues(prev => ({ ...prev, combo_items: (prev.combo_items || []).filter((_, i) => i !== idx) }));

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setFilesToCrop(files);
        setCurrentCropFile(files[0]);
        e.target.value = '';
    };

    const handleCropApply = async (pixelCrop) => {
        setUploadingImg(true);
        const file = currentCropFile;
        
        const processFile = (file, pixelCrop) => new Promise((resolve) => {
            const processImageSrc = (src) => {
                const img = new Image();
                if (src.startsWith('http')) {
                    img.crossOrigin = 'Anonymous';
                }
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const SZ = 1200;
                    canvas.width = SZ; canvas.height = SZ;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SZ, SZ);
                    const { x: sx, y: sy, width: sw, height: sh } = pixelCrop;
                    const scale = Math.min(SZ / sw, SZ / sh);
                    const dw = sw * scale, dh = sh * scale;
                    ctx.drawImage(img, sx, sy, sw, sh, (SZ - dw) / 2, (SZ - dh) / 2, dw, dh);
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            toast.error('Could not process image crop.');
                            return resolve(null);
                        }
                        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
                        const { error } = await supabase.storage.from('images').upload(fileName, blob, { contentType: 'image/jpeg' });
                        if (error) { toast.error('Upload error: ' + error.message); resolve(null); }
                        else { const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName); resolve(publicUrl); }
                    }, 'image/jpeg', 0.85);
                };
                img.onerror = () => { toast.error('Image load error during crop'); resolve(null); };
                img.src = src;
            };
            
            if (typeof file === 'string') {
                processImageSrc(file);
            } else if (file instanceof Blob || file instanceof File) {
                const url = URL.createObjectURL(file);
                processImageSrc(url);
            } else {
                resolve(null);
            }
        });

        const url = await processFile(file, pixelCrop);
        if (url) {
            setValues((prev) => {
                const imgs = [...(prev.images || [])];
                if (editingImageIndex !== null) imgs[editingImageIndex] = url; else imgs.push(url);
                return { ...prev, images: imgs, image: imgs[0] || '' };
            });
        }

        if (editingImageIndex !== null) { setEditingImageIndex(null); setCurrentCropFile(null); }
        else { const next = filesToCrop.slice(1); setFilesToCrop(next); setCurrentCropFile(next[0] || null); }
        setUploadingImg(false);
    };

    const handleCropCancel = () => {
        if (editingImageIndex !== null) { setEditingImageIndex(null); setCurrentCropFile(null); }
        else { const next = filesToCrop.slice(1); setFilesToCrop(next); setCurrentCropFile(next[0] || null); }
    };

    const removeImage = (i) => setValues((prev) => { const imgs = prev.images.filter((_, j) => j !== i); return { ...prev, images: imgs, image: imgs[0] || '' }; });

    const updateOutsidePrice = (region, price) => setOutsidePrices(prev => { const u = { ...prev }; if (price === '') delete u[region]; else u[region] = Number(price) || 0; return u; });

    return (
        <>
            {currentCropFile && <ImageCropperModal file={currentCropFile} onApply={handleCropApply} onCancel={handleCropCancel} />}
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit({
                    ...v,
                    price: Number(v.price) || null,
                    discount_price: Number(v.discount_price) || null,
                    rating: Number(v.rating) || 5.0,
                    review_count: Number(v.review_count) || 0,
                    delivery_nairobi: Number(v.delivery_nairobi) || 600,
                    delivery_outside: JSON.stringify({ ...outsidePrices, metadata: { size: v.size, piece_price: v.piece_price, images: v.images, combo_items: v.combo_items } }),
                    transport_method: v.transport_method || null,
                    piece_price: undefined, size: undefined, images: undefined, combo_items: undefined,
                });
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div><label style={labelStyle}>Product name *</label><input style={inputStyle} value={v.name} onChange={set('name')} required placeholder="e.g. Chesterfield Sofa Set" /></div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Category *</label>
                            <input list="cat-list" style={inputStyle} value={v.category} onChange={set('category')} required placeholder="Select or type..." />
                            <datalist id="cat-list">{CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
                        </div>
                        <div>
                            <label style={labelStyle}>Subcategory</label>
                            <input list="sub-list" style={inputStyle} value={v.subcategory} onChange={set('subcategory')} placeholder="Select or type..." />
                            <datalist id="sub-list">{(SUBCATEGORIES[v.category] || []).map(s => <option key={s} value={s} />)}</datalist>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div><label style={labelStyle}>Price (KSh)</label><input style={inputStyle} type="number" min="0" value={v.price} onChange={set('price')} placeholder="POA if blank" /></div>
                        <div><label style={labelStyle}>Per Piece Price</label><input style={inputStyle} type="number" min="0" value={v.piece_price || ''} onChange={set('piece_price')} placeholder="Optional" /></div>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select style={inputStyle} value={v.in_stock ? 'In Stock' : 'Out of Stock'} onChange={(e) => setValues(p => ({ ...p, in_stock: e.target.value === 'In Stock' }))}>
                                <option>In Stock</option><option>Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {v.category === 'Combo Items' && (
                        <div style={{ background: '#f9fafb', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
                            <div style={{ ...labelStyle, color: COLORS.gold, marginBottom: 12 }}>Combo Items</div>
                            {(v.combo_items || []).map((ci, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 10 }}>
                                    <div style={{ flex: 1 }}><label style={labelStyle}>Name</label><input style={inputStyle} value={ci.name || ''} onChange={e => handleComboChange(i, 'name', e.target.value)} placeholder="3-Seater Sofa" /></div>
                                    <div style={{ width: 120 }}><label style={labelStyle}>Price</label><input style={inputStyle} type="number" value={ci.price || ''} onChange={e => handleComboChange(i, 'price', e.target.value)} /></div>
                                    <div style={{ width: 100 }}><label style={labelStyle}>Discount</label><input style={inputStyle} type="number" value={ci.discount || ''} onChange={e => handleComboChange(i, 'discount', e.target.value)} /></div>
                                    <button type="button" style={{ ...iconBtnStyle, color: COLORS.rust, marginBottom: 2 }} onClick={() => handleRemoveCombo(i)}><IconX /></button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddComboItem} style={{ fontSize: 13, fontWeight: 600, color: COLORS.gold, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Combo Item</button>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Badge</label>
                            <select style={inputStyle} value={v.badge || ''} onChange={set('badge')}>
                                <option value="">None</option><option>New</option><option>Best Seller</option><option>Sale</option><option>Limited Stock</option>
                            </select>
                        </div>
                        <div><label style={labelStyle}>Rating</label><input style={inputStyle} type="number" min="1" max="5" step="0.1" value={v.rating} onChange={set('rating')} /></div>
                        <div><label style={labelStyle}>Reviews</label><input style={inputStyle} type="number" min="0" value={v.review_count} onChange={set('review_count')} /></div>
                    </div>

                    <div style={{ background: '#f9fafb', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
                        <div style={{ ...labelStyle, color: COLORS.gold, marginBottom: 12 }}>🚛 DELIVERY PRICING</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div><label style={labelStyle}>Nairobi (KSh)</label><input style={inputStyle} type="number" min="0" value={v.delivery_nairobi} onChange={set('delivery_nairobi')} placeholder="600" /></div>
                            <div>
                                <label style={labelStyle}>Transport Method</label>
                                <select style={inputStyle} value={v.transport_method || ''} onChange={set('transport_method')}>
                                    <option value="">Select...</option>
                                    {TRANSPORT_METHODS.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <label style={labelStyle}>Outside Nairobi Prices</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 6 }}>
                            {DELIVERY_REGIONS.map(r => (
                                <div key={r}>
                                    <label style={{ fontSize: 11, color: COLORS.muted, display: 'block', marginBottom: 3 }}>{r}</label>
                                    <input style={{ ...inputStyle, fontSize: 12 }} type="number" min="0" placeholder="KSh" value={outsidePrices[r] || ''} onChange={(e) => updateOutsidePrice(r, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={v.description} onChange={set('description')} /></div>
                    <div><label style={labelStyle}>Size / Dimensions</label><input style={inputStyle} value={v.size || ''} onChange={set('size')} placeholder="e.g. 1.2m × 0.6m × 0.75m" /></div>

                    <div>
                        <label style={labelStyle}>Product Images</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                            {(v.images?.length > 0 ? v.images : (v.image ? [v.image] : [])).map((url, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: `1px solid ${COLORS.border}` }} />
                                    <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, background: COLORS.rust, color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                    <button type="button" onClick={() => { setEditingImageIndex(i); setCurrentCropFile(url); }} style={{ position: 'absolute', bottom: -6, right: -6, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                                </div>
                            ))}
                            <label style={{ cursor: uploadingImg ? 'wait' : 'pointer', width: 64, height: 64, border: `2px dashed ${COLORS.border}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImg} />
                                <span style={{ fontSize: 24, color: COLORS.muted }}>+</span>
                            </label>
                        </div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                        <input type="checkbox" checked={v.featured} onChange={set('featured')} />
                        Featured Product
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                    <button type="button" style={btnSecondary} onClick={onCancel}>Cancel</button>
                    <button type="submit" style={btnPrimary}>{initialData ? 'Update Product' : 'Save Product'}</button>
                </div>
            </form>
        </>
    );
}

function HeroSlideForm({ onClose, onSave }) {
    const [data, setData] = useState({ title: '', subtitle: '', image: '' });
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        try {
            // Helper to convert any image to an optimized JPEG
            const processImage = (file) => new Promise((resolve, reject) => {
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 1600; // slightly larger for hero images
                    let w = img.width, h = img.height;
                    if (w > MAX_SIZE || h > MAX_SIZE) {
                        if (w > h) { h = Math.round((h * MAX_SIZE) / w); w = MAX_SIZE; }
                        else { w = Math.round((w * MAX_SIZE) / h); h = MAX_SIZE; }
                    }
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85);
                    URL.revokeObjectURL(url);
                };
                img.onerror = () => reject(new Error('Failed to load image for processing'));
                img.src = url;
            });

            const processedBlob = await processImage(file);
            const name = `hero-${Date.now()}.jpg`;
            
            const { error } = await supabase.storage.from('images').upload(name, processedBlob);
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(name);
            setData({ ...data, image: publicUrl });
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={labelStyle}>Slide Image</label>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'block', marginBottom: 10 }} />
                {uploading && <div style={{ fontSize: 12, color: COLORS.muted }}>Uploading... Please wait.</div>}
                {data.image && <img src={data.image} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginTop: 10 }} />}
            </div>
            <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="e.g. Durable. Stylish." />
            </div>
            <div>
                <label style={labelStyle}>Subtitle (Eyebrow text above title)</label>
                <input style={inputStyle} value={data.subtitle} onChange={e => setData({ ...data, subtitle: e.target.value })} placeholder="e.g. Discover the perfect design" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" style={btnSecondary} onClick={onClose}>Cancel</button>
                <button type="button" style={btnPrimary} onClick={() => onSave(data)} disabled={!data.image || !data.title || uploading}>Save Slide</button>
            </div>
        </div>
    );
}

/* ---------- Sale Form ---------- */
function SaleForm({ onSubmit, onCancel }) {
    const [v, set] = useForm({ customer: '', phone: '', item: '', branch: 'Nairobi', amount: '', payment: 'Full', method: 'M-PESA', sendReceipt: false });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...v, amount: Number(v.amount) || 0, date: TODAY }); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Customer name</label><input style={inputStyle} value={v.customer} onChange={set('customer')} required /></div>
                    <div><label style={labelStyle}>Phone (for receipt)</label><input style={inputStyle} value={v.phone} onChange={set('phone')} placeholder="07xx xxx xxx" /></div>
                </div>
                <div><label style={labelStyle}>Item(s) sold</label><input style={inputStyle} value={v.item} onChange={set('item')} required placeholder="e.g. Glass Coffee Table" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Amount (KSh)</label><input style={inputStyle} type="number" min="0" value={v.amount} onChange={set('amount')} required /></div>
                    <div><label style={labelStyle}>Branch</label><select style={inputStyle} value={v.branch} onChange={set('branch')}>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Payment</label><select style={inputStyle} value={v.payment} onChange={set('payment')}><option>Full</option><option>Deposit</option></select></div>
                    <div><label style={labelStyle}>Method</label><select style={inputStyle} value={v.method} onChange={set('method')}><option>M-PESA</option><option>Cash</option><option>Bank Transfer</option></select></div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: `1px solid ${v.sendReceipt ? '#25D366' : COLORS.border}`, background: v.sendReceipt ? '#f0fdf4' : COLORS.surface, cursor: 'pointer' }}>
                    <input type="checkbox" checked={v.sendReceipt} onChange={set('sendReceipt')} />
                    <span style={{ fontSize: 13, color: v.sendReceipt ? '#16a34a' : COLORS.muted, fontWeight: 500 }}>📱 Send WhatsApp receipt to customer</span>
                </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" style={btnSecondary} onClick={onCancel}>Cancel</button>
                <button type="submit" style={btnPrimary}>Save Sale</button>
            </div>
        </form>
    );
}

/* ---------- Credit Form ---------- */
function CreditForm({ onSubmit, onCancel }) {
    const [v, set] = useForm({ customer: '', phone: '', item: '', total: '', deposit: '', due_date: '', branch: 'Nairobi' });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ customer: v.customer, phone: v.phone, item: v.item, total: Number(v.total) || 0, paid: Number(v.deposit) || 0, due_date: v.due_date, branch: v.branch }); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Customer name</label><input style={inputStyle} value={v.customer} onChange={set('customer')} required /></div>
                    <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={v.phone} onChange={set('phone')} placeholder="07xx xxx xxx" required /></div>
                </div>
                <div><label style={labelStyle}>Item(s)</label><input style={inputStyle} value={v.item} onChange={set('item')} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Total Amount (KSh)</label><input style={inputStyle} type="number" min="0" value={v.total} onChange={set('total')} required /></div>
                    <div><label style={labelStyle}>Deposit Paid (KSh)</label><input style={inputStyle} type="number" min="0" value={v.deposit} onChange={set('deposit')} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Balance Due Date</label><input style={inputStyle} type="date" value={v.due_date} onChange={set('due_date')} required /></div>
                    <div><label style={labelStyle}>Branch</label><select style={inputStyle} value={v.branch} onChange={set('branch')}>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select></div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" style={btnSecondary} onClick={onCancel}>Cancel</button>
                <button type="submit" style={btnPrimary}>Save Credit Sale</button>
            </div>
        </form>
    );
}

/* ---------- Expense Form ---------- */
function ExpenseForm({ onSubmit, onCancel }) {
    const [v, set] = useForm({ date: TODAY, category: 'Materials', description: '', amount: '', branch: 'Nairobi' });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...v, amount: Number(v.amount) || 0 }); }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Date</label><input style={inputStyle} type="date" value={v.date} onChange={set('date')} required /></div>
                    <div><label style={labelStyle}>Category</label><select style={inputStyle} value={v.category} onChange={set('category')}>{['Materials', 'Transport', 'Wages', 'Rent', 'Utilities', 'Marketing', 'Other'].map(c => <option key={c}>{c}</option>)}</select></div>
                </div>
                <div><label style={labelStyle}>Description</label><input style={inputStyle} value={v.description} onChange={set('description')} required placeholder="What was this for?" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Amount (KSh)</label><input style={inputStyle} type="number" min="0" value={v.amount} onChange={set('amount')} required /></div>
                    <div><label style={labelStyle}>Branch</label><select style={inputStyle} value={v.branch} onChange={set('branch')}>{BRANCHES.map(b => <option key={b}>{b}</option>)}</select></div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" style={btnSecondary} onClick={onCancel}>Cancel</button>
                <button type="submit" style={btnPrimary}>Save Expense</button>
            </div>
        </form>
    );
}

/* ---------- Payment Form ---------- */
function PaymentForm({ record, onSubmit, onCancel }) {
    const [amount, setAmount] = useState('');
    if (!record) return null;
    const balance = record.total - record.paid;
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(Number(amount) || 0); }}>
            <div style={{ marginBottom: 16, fontSize: 14, color: COLORS.muted }}>
                {record.customer} — balance <strong style={{ fontFamily: fontMono, color: COLORS.text }}>{fmt(balance)}</strong>
            </div>
            <label style={labelStyle}>Payment amount (KSh)</label>
            <input style={inputStyle} type="number" min="0" max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" style={btnSecondary} onClick={onCancel}>Cancel</button>
                <button type="submit" style={btnPrimary}>Record Payment</button>
            </div>
        </form>
    );
}

/* ================================================================
   PAGES
   ================================================================ */

/* ---------- Dashboard ---------- */
function DashboardPage({ products, sales, credit, expenses, setActiveTab }) {
    const [filter, setFilter] = useState('today');
    const [customDate, setCustomDate] = useState(TODAY);

    const inFilter = (dateStr) => {
        if (!dateStr) return false;
        if (filter === 'all') return true;
        if (filter === 'today') return dateStr === TODAY;
        if (filter === 'custom') return dateStr === customDate;
        const d = new Date(dateStr), now = new Date();
        if (filter === 'week') return now - d <= 7 * 86400000;
        if (filter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filter === 'year') return d.getFullYear() === now.getFullYear();
        return true;
    };

    const filtSales = sales.filter(s => inFilter(s.date));
    const filtSalesTotal = filtSales.reduce((a, s) => a + s.amount, 0);
    const filtExp = expenses.filter(e => inFilter(e.date));
    const filtExpTotal = filtExp.reduce((a, e) => a + e.amount, 0);
    const outstanding = credit.filter(c => c.total > c.paid);
    const outstandingTotal = outstanding.reduce((a, c) => a + (c.total - c.paid), 0);
    const outOfStock = products.filter(p => !p.in_stock).length;

    const label = (base) => ({ today: `Today's ${base}`, week: `This week's ${base}`, month: `This month's ${base}`, year: `This year's ${base}`, all: `All time ${base}`, custom: `${customDate} ${base}` }[filter] || base);

    return (
        <div>
            <PageHeader eyebrow="Overview" title="Dashboard"
                action={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {filter === 'custom' && <input type="date" style={{ ...inputStyle, width: 150, padding: '6px 10px', fontSize: 13 }} value={customDate} onChange={e => setCustomDate(e.target.value)} />}
                        <select style={{ ...inputStyle, width: 150, padding: '6px 10px', fontSize: 13 }} value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option><option value="year">This Year</option><option value="all">All Time</option><option value="custom">Custom Date</option>
                        </select>
                    </div>
                }
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard label={label('sales')} value={fmt(filtSalesTotal)} accent={COLORS.green} onClick={() => setActiveTab('sales')} />
                <StatCard label="Credit outstanding" value={fmt(outstandingTotal)} sub={`${outstanding.length} account(s)`} accent={COLORS.amber} onClick={() => setActiveTab('credit')} />
                <StatCard label={label('expenses')} value={fmt(filtExpTotal)} accent={COLORS.rust} onClick={() => setActiveTab('expenses')} />
                <StatCard label="Out of stock" value={outOfStock} sub="Products" accent={COLORS.gold} onClick={() => setActiveTab('products')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                    <h3 style={sectionTitleStyle}>Recent Sales</h3>
                    <div style={cardStyle}>
                        {sales.length === 0 && <EmptyRow text="No sales recorded yet." />}
                        {[...sales].reverse().slice(0, 5).map(s => (
                            <div key={s.id} style={{ ...rowItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><div style={{ fontWeight: 500 }}>{s.customer}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{s.item} · {s.branch}</div></div>
                                <div style={{ fontFamily: fontMono, fontWeight: 500 }}>{fmt(s.amount)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 style={sectionTitleStyle}>Credit Due Soon</h3>
                    <div style={cardStyle}>
                        {outstanding.length === 0 && <EmptyRow text="No outstanding credit." />}
                        {outstanding.map(c => (
                            <div key={c.id} style={{ ...rowItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><div style={{ fontWeight: 500 }}>{c.customer}</div><div style={{ fontSize: 12, color: COLORS.muted }}>Due {c.due_date} · {c.branch}</div></div>
                                <div style={{ fontFamily: fontMono, fontWeight: 500, color: COLORS.amber }}>{fmt(c.total - c.paid)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- Products ---------- */
function ProductsPage({ products, handleDeleteProduct, openModal, handleBulkUpload, uploadingBulk }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const cats = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
    const filtered = products.filter(p => (category === 'All' || p.category === category) && (p.name || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <PageHeader eyebrow="Inventory" title="Products"
                action={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <label style={{ ...btnSecondary, cursor: uploadingBulk ? 'wait' : 'pointer' }}>
                            ↑ {uploadingBulk ? 'Uploading…' : 'Bulk Upload'}
                            <input type="file" accept="image/*" multiple onChange={handleBulkUpload} style={{ display: 'none' }} disabled={uploadingBulk} />
                        </label>
                        <button style={btnPrimary} onClick={() => openModal('product')}>
                            <IconPlus /> Add Product
                        </button>
                    </div>
                }
            />
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <IconSearch style={{ position: 'absolute', left: 12, top: 11, color: COLORS.muted, pointerEvents: 'none' }} />
                    <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select style={{ ...inputStyle, width: 'auto', minWidth: 150 }} value={category} onChange={e => setCategory(e.target.value)}>
                    {cats.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                        <thead><tr style={{ background: COLORS.surface2 }}>
                            <th style={thStyle}>Product</th><th style={thStyle}>Category</th><th style={thStyle}>Price</th><th style={thStyle}>Status</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr></thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} style={{ background: COLORS.surface }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {p.image ? <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: `1px solid ${COLORS.border}` }} /> : <div style={{ width: 40, height: 40, borderRadius: 6, background: COLORS.surface2 }} />}
                                            <span style={{ fontWeight: 500 }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, color: COLORS.muted }}>{p.category}</td>
                                    <td style={{ ...tdStyle, fontFamily: fontMono }}>{p.price ? fmt(p.price) : 'POA'}</td>
                                    <td style={tdStyle}><Badge color={p.in_stock ? COLORS.green : COLORS.rust}>{p.in_stock ? 'In Stock' : 'Out of Stock'}</Badge></td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <button style={{ ...iconBtnStyle, color: COLORS.gold, marginRight: 8 }} onClick={() => openModal({ type: 'edit_product', product: p })}><IconEdit /></button>
                                        <button style={{ ...iconBtnStyle, color: COLORS.rust }} onClick={() => handleDeleteProduct(p.id)}><IconTrash /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={5}><EmptyRow text="No products found. Add one above." /></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ---------- Sales ---------- */
function SalesPage({ sales, openModal, handleDeleteSale }) {
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('All');
    const filtered = sales.filter(s => (branch === 'All' || s.branch === branch) && `${s.customer} ${s.item}`.toLowerCase().includes(search.toLowerCase()));
    const total = filtered.reduce((a, s) => a + s.amount, 0);

    return (
        <div>
            <PageHeader eyebrow="Revenue" title="Sales"
                action={<button style={btnPrimary} onClick={() => openModal('sale')}><IconPlus /> Record Sale</button>}
            />
            <div style={{ ...cardStyle, padding: '14px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: COLORS.muted }}>Showing {filtered.length} sale(s)</span>
                <span style={{ fontFamily: fontMono, fontWeight: 600, color: COLORS.text }}>{fmt(total)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <IconSearch style={{ position: 'absolute', left: 12, top: 11, color: COLORS.muted, pointerEvents: 'none' }} />
                    <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select style={{ ...inputStyle, width: 'auto', minWidth: 150 }} value={branch} onChange={e => setBranch(e.target.value)}>
                    <option>All</option>{BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
            </div>
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                        <thead><tr style={{ background: COLORS.surface2 }}>
                            <th style={thStyle}>Customer</th><th style={thStyle}>Item</th><th style={thStyle}>Amount</th><th style={thStyle}>Method</th><th style={thStyle}>Date</th><th style={thStyle}>Branch</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={7}><EmptyRow text="No sales recorded yet." /></td></tr>}
                            {[...filtered].reverse().map(s => (
                                <tr key={s.id}>
                                    <td style={tdStyle}><div style={{ fontWeight: 500 }}>{s.customer}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{s.phone}</div></td>
                                    <td style={tdStyle}>{s.item}</td>
                                    <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(s.amount)}</td>
                                    <td style={tdStyle}><Badge color={s.method === 'M-PESA' ? COLORS.green : COLORS.muted}>{s.method}</Badge></td>
                                    <td style={{ ...tdStyle, color: COLORS.muted }}>{s.date}</td>
                                    <td style={{ ...tdStyle, color: COLORS.muted }}>{s.branch}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        {s.phone && <button style={{ ...iconBtnStyle, color: '#25D366', marginRight: 6 }} onClick={() => sendSaleReceiptWhatsApp(s)} title="Send WhatsApp receipt"><IconWhatsApp /></button>}
                                        <button style={{ ...iconBtnStyle, color: COLORS.rust }} onClick={() => handleDeleteSale(s.id)}><IconTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ---------- Credit ---------- */
function CreditPage({ credit, openModal, handleDeleteCredit, handleRecordPayment }) {
    const [search, setSearch] = useState('');
    const [showSettled, setShowSettled] = useState(false);
    const filtered = credit.filter(c => {
        const settled = c.total <= c.paid;
        if (!showSettled && settled) return false;
        return `${c.customer} ${c.item}`.toLowerCase().includes(search.toLowerCase());
    });
    const outstandingTotal = credit.filter(c => c.total > c.paid).reduce((a, c) => a + (c.total - c.paid), 0);

    return (
        <div>
            <PageHeader eyebrow="Credit Book" title="Credit Sales"
                action={<button style={btnPrimary} onClick={() => openModal('credit')}><IconPlus /> New Credit Sale</button>}
            />
            <div style={{ ...cardStyle, padding: '14px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: COLORS.muted }}>Total outstanding</span>
                <span style={{ fontFamily: fontMono, fontWeight: 600, color: COLORS.amber }}>{fmt(outstandingTotal)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <IconSearch style={{ position: 'absolute', left: 12, top: 11, color: COLORS.muted, pointerEvents: 'none' }} />
                    <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Search customer or item…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={showSettled} onChange={e => setShowSettled(e.target.checked)} />
                    Show settled
                </label>
            </div>
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                        <thead><tr style={{ background: COLORS.surface2 }}>
                            <th style={thStyle}>Customer</th><th style={thStyle}>Item</th><th style={thStyle}>Total</th><th style={thStyle}>Paid</th><th style={thStyle}>Balance</th><th style={thStyle}>Due</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={7}><EmptyRow text="No credit records." /></td></tr>}
                            {filtered.map(c => {
                                const bal = c.total - c.paid;
                                const settled = bal <= 0;
                                return (
                                    <tr key={c.id}>
                                        <td style={tdStyle}><div style={{ fontWeight: 500 }}>{c.customer}</div><div style={{ fontSize: 12, color: COLORS.muted }}>{c.phone}</div></td>
                                        <td style={tdStyle}>{c.item}</td>
                                        <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(c.total)}</td>
                                        <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(c.paid)}</td>
                                        <td style={{ ...tdStyle, fontFamily: fontMono, color: settled ? COLORS.green : COLORS.amber }}>{settled ? '✓ Settled' : fmt(bal)}</td>
                                        <td style={{ ...tdStyle, color: COLORS.muted }}>{c.due_date}</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            {!settled && <>
                                                <button style={{ ...iconBtnStyle, color: '#25D366', marginRight: 6 }} onClick={() => sendCreditReminderWhatsApp(c)} title="Send reminder"><IconWhatsApp /></button>
                                                <button style={{ ...btnPrimary, fontSize: 12, padding: '5px 12px', marginRight: 6 }} onClick={() => handleRecordPayment(c)}>+ Pay</button>
                                            </>}
                                            <button style={{ ...iconBtnStyle, color: COLORS.rust }} onClick={() => handleDeleteCredit(c.id)}><IconTrash /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ---------- Expenses ---------- */
function ExpensesPage({ expenses, openModal, handleDeleteExpense }) {
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('All');
    const filtered = expenses.filter(e => (branch === 'All' || e.branch === branch) && `${e.description} ${e.category}`.toLowerCase().includes(search.toLowerCase()));
    const total = filtered.reduce((a, e) => a + e.amount, 0);
    const byCat = filtered.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});

    return (
        <div>
            <PageHeader eyebrow="Costs" title="Expenses"
                action={<button style={btnPrimary} onClick={() => openModal('expense')}><IconPlus /> Record Expense</button>}
            />
            <div style={{ ...cardStyle, padding: '14px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    {Object.entries(byCat).slice(0, 4).map(([cat, amt]) => (
                        <span key={cat} style={{ fontSize: 12, color: COLORS.muted }}>{cat}: <strong style={{ fontFamily: fontMono, color: COLORS.text }}>{fmt(amt)}</strong></span>
                    ))}
                </div>
                <span style={{ fontFamily: fontMono, fontWeight: 600, color: COLORS.rust }}>{fmt(total)} total</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <IconSearch style={{ position: 'absolute', left: 12, top: 11, color: COLORS.muted, pointerEvents: 'none' }} />
                    <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select style={{ ...inputStyle, width: 'auto', minWidth: 150 }} value={branch} onChange={e => setBranch(e.target.value)}>
                    <option>All</option>{BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
            </div>
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 450 }}>
                        <thead><tr style={{ background: COLORS.surface2 }}>
                            <th style={thStyle}>Date</th><th style={thStyle}>Category</th><th style={thStyle}>Description</th><th style={thStyle}>Branch</th><th style={thStyle}>Amount</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={6}><EmptyRow text="No expenses recorded." /></td></tr>}
                            {[...filtered].reverse().map(e => (
                                <tr key={e.id}>
                                    <td style={{ ...tdStyle, color: COLORS.muted }}>{e.date}</td>
                                    <td style={tdStyle}><Badge color={COLORS.rust}>{e.category}</Badge></td>
                                    <td style={tdStyle}>{e.description}</td>
                                    <td style={{ ...tdStyle, color: COLORS.muted }}>{e.branch}</td>
                                    <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.rust }}>{fmt(e.amount)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <button style={{ ...iconBtnStyle, color: COLORS.rust }} onClick={() => handleDeleteExpense(e.id)}><IconTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ---------- Messages / WhatsApp ---------- */
function MessagesPage({ credit, sales }) {
    const outstanding = credit.filter(c => c.total > c.paid);
    return (
        <div>
            <PageHeader eyebrow="WhatsApp" title="Messages" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                    <h3 style={sectionTitleStyle}>Send Credit Reminders</h3>
                    <div style={cardStyle}>
                        {outstanding.length === 0 && <EmptyRow text="All credit accounts settled." />}
                        {outstanding.map(c => (
                            <div key={c.id} style={{ ...rowItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{c.customer}</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>{c.phone} · Balance: {fmt(c.total - c.paid)}</div>
                                </div>
                                <button style={{ ...btnPrimary, background: '#25D366', fontSize: 12, padding: '6px 14px' }} onClick={() => sendCreditReminderWhatsApp(c)}>
                                    <IconWhatsApp /> Remind
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 style={sectionTitleStyle}>Resend Sale Receipts</h3>
                    <div style={cardStyle}>
                        {sales.length === 0 && <EmptyRow text="No sales recorded yet." />}
                        {[...sales].reverse().slice(0, 10).map(s => (
                            <div key={s.id} style={{ ...rowItemStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{s.customer}</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>{s.phone || 'No phone'} · {s.item}</div>
                                </div>
                                <button style={{ ...btnPrimary, background: s.phone ? '#25D366' : COLORS.muted, fontSize: 12, padding: '6px 14px' }} onClick={() => s.phone && sendSaleReceiptWhatsApp(s)} disabled={!s.phone}>
                                    <IconWhatsApp /> Receipt
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   MAIN ADMIN PANEL
   ================================================================ */
const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: IconGauge },
    { id: 'products', label: 'Products', icon: IconBox },
    { id: 'sales', label: 'Sales', icon: IconBanknote },
    { id: 'credit', label: 'Credit Book', icon: IconCard },
    { id: 'expenses', label: 'Expenses', icon: IconReceipt },
    { id: 'messages', label: 'WhatsApp', icon: IconChat },
    { id: 'inquiries', label: 'Inquiries (AI)', icon: IconChat },
    { id: 'hero', label: 'Hero Slides', icon: IconImage },
];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null); // null | 'product' | 'sale' | 'credit' | 'expense' | 'hero_slide' | { type:'edit_product', product } | { type:'payment', record }
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [uploadingBulk, setUploadingBulk] = useState(false);

    // Data
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [credit, setCredit] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [heroSlides, setHeroSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ---- Fetch all data ---- */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [p, s, cr, ex, hs] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('sales').select('*').order('created_at', { ascending: false }),
                supabase.from('credit').select('*').order('created_at', { ascending: false }),
                supabase.from('expenses').select('*').order('created_at', { ascending: false }),
                supabase.from('hero_slides').select('*').order('created_at', { ascending: false }),
            ]);
            if (p.error) toast.error('Products: ' + p.error.message);
            if (s.error) toast.error('Sales: ' + s.error.message);
            if (cr.error) toast.error('Credit: ' + cr.error.message);
            if (ex.error) toast.error('Expenses: ' + ex.error.message);
            if (hs.error) toast.error('Hero Slides: ' + hs.error.message);
            setProducts(p.data || []);
            setSales(s.data || []);
            setCredit(cr.data || []);
            setExpenses(ex.data || []);
            setHeroSlides(hs.data || []);
            setLoading(false);
        };
        load();
    }, []);

    /* ---- Products CRUD ---- */
    const handleSaveProduct = async (data) => {
        const isEdit = modal?.type === 'edit_product';
        const { error, data: saved } = isEdit
            ? await supabase.from('products').update(data).eq('id', modal.product.id).select().single()
            : await supabase.from('products').insert(data).select().single();
        if (error) { toast.error('Error: ' + error.message); return; }
        setProducts(prev => isEdit ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev]);
        toast.success(isEdit ? 'Product updated!' : 'Product added!');
        setModal(null);
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Product deleted.');
    };

    const handleBulkUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploadingBulk(true);
        let uploaded = 0;
        const newProducts = [];
        
        // Helper to convert any image to an optimized JPEG
        const processImage = (file) => new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 1200;
                let w = img.width, h = img.height;
                if (w > MAX_SIZE || h > MAX_SIZE) {
                    if (w > h) { h = Math.round((h * MAX_SIZE) / w); w = MAX_SIZE; }
                    else { w = Math.round((w * MAX_SIZE) / h); h = MAX_SIZE; }
                }
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85);
                URL.revokeObjectURL(url);
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });

        for (const file of files) {
            const blob = await processImage(file);
            if (!blob) continue;

            const name = `bulk-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
            const { error } = await supabase.storage.from('images').upload(name, blob, { contentType: 'image/jpeg' });
            
            if (!error) {
                uploaded++;
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(name);
                
                const draftProduct = {
                    name: 'Draft',
                    category: 'Living Room',
                    price: 0,
                    image: publicUrl,
                    in_stock: true,
                    description: 'Draft product created from bulk upload.',
                    delivery_outside: '{}'
                };
                
                const { data: saved } = await supabase.from('products').insert(draftProduct).select().single();
                if (saved) newProducts.push(saved);
            }
        }
        
        if (newProducts.length > 0) {
            setProducts(prev => [...newProducts, ...prev]);
        }
        
        toast.success(`Processed and created ${newProducts.length} draft products!`);
        setUploadingBulk(false);
        e.target.value = '';
    };

    /* ---- Sales CRUD ---- */
    const handleSaveSale = async (data) => {
        const { sendReceipt, ...saleData } = data;
        const { error, data: saved } = await supabase.from('sales').insert(saleData).select().single();
        if (error) { toast.error(error.message); return; }
        setSales(prev => [saved, ...prev]);
        toast.success('Sale recorded!');
        if (sendReceipt && data.phone) sendSaleReceiptWhatsApp(saved);
        sendOrderToAdminWhatsApp(saved);
        setModal(null);
    };

    const handleDeleteSale = async (id) => {
        if (!confirm('Delete this sale?')) return;
        const { error } = await supabase.from('sales').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        setSales(prev => prev.filter(s => s.id !== id));
        toast.success('Sale deleted.');
    };

    /* ---- Credit CRUD ---- */
    const handleSaveCredit = async (data) => {
        const { error, data: saved } = await supabase.from('credit').insert(data).select().single();
        if (error) { toast.error(error.message); return; }
        setCredit(prev => [saved, ...prev]);
        toast.success('Credit sale recorded!');
        if (data.phone) sendNewCreditReceiptWhatsApp(saved);
        setModal(null);
    };

    const handleDeleteCredit = async (id) => {
        if (!confirm('Delete this credit record?')) return;
        const { error } = await supabase.from('credit').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        setCredit(prev => prev.filter(c => c.id !== id));
        toast.success('Credit record deleted.');
    };

    const handleRecordPayment = (record) => setModal({ type: 'payment', record });

    const handleSavePayment = async (amount) => {
        const record = modal.record;
        const newPaid = record.paid + amount;
        const { error, data: updated } = await supabase.from('credit').update({ paid: newPaid }).eq('id', record.id).select().single();
        if (error) { toast.error(error.message); return; }
        setCredit(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast.success(`Payment of ${fmt(amount)} recorded.`);
        setModal(null);
    };

    /* ---- Expenses CRUD ---- */
    const handleSaveExpense = async (data) => {
        const { error, data: saved } = await supabase.from('expenses').insert(data).select().single();
        if (error) { toast.error(error.message); return; }
        setExpenses(prev => [saved, ...prev]);
        toast.success('Expense recorded!');
        setModal(null);
    };

    const handleDeleteExpense = async (id) => {
        if (!confirm('Delete this expense?')) return;
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast.success('Expense deleted.');
    };

    /* ---- Sidebar ---- */
    const Sidebar = () => (
        <aside style={{ width: sidebarOpen ? 240 : 68, minWidth: sidebarOpen ? 240 : 68, background: COLORS.sidebar, display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0, borderRight: `1px solid ${COLORS.sidebarBorder}` }}>
            {/* Brand */}
            <div style={{ padding: '22px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${COLORS.sidebarBorder}`, minHeight: 72 }}>
                <LogoMark />
                {sidebarOpen && (
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: '#fff', fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Luxe Craft Admin</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Management</div>
                    </div>
                )}
            </div>
            {/* Nav */}
            <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
                {sidebarOpen && <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '12px 12px 8px', fontWeight: 700 }}>Navigation</div>}
                {NAV.map(({ id, label, icon: Icon }) => {
                    const active = activeTab === id;
                    return (
                        <button key={id} onClick={() => setActiveTab(id)} title={!sidebarOpen ? label : undefined} style={{ width: '100%', background: active ? COLORS.sidebarActive : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '10px 14px' : '12px', borderRadius: 10, color: active ? COLORS.sidebarActiveText : COLORS.sidebarText, fontFamily: fontBody, fontSize: 13.5, fontWeight: active ? 600 : 400, marginBottom: 2, transition: 'all 0.15s', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                            <Icon width={17} height={17} style={{ flexShrink: 0 }} />
                            {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                            {active && sidebarOpen && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: COLORS.sidebarActiveText, flexShrink: 0 }} />}
                        </button>
                    );
                })}
            </nav>
            {/* Footer */}
            <div style={{ padding: '10px 8px 16px', borderTop: `1px solid ${COLORS.sidebarBorder}` }}>
                <button onClick={() => window.location.href = '/'} title={!sidebarOpen ? 'Back to Site' : undefined} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '10px 14px' : '12px', borderRadius: 10, color: 'rgba(255,255,255,0.35)', fontSize: 13.5, fontFamily: fontBody, transition: 'color 0.15s', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                    <IconLogout width={17} height={17} />
                    {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>Back to Site</span>}
                </button>
            </div>
        </aside>
    );

    /* ---- Active Page ---- */
    const renderPage = () => {
        if (loading) return <div style={{ padding: 48, textAlign: 'center', color: COLORS.muted }}>Loading…</div>;
        switch (activeTab) {
            case 'dashboard': return <DashboardPage products={products} sales={sales} credit={credit} expenses={expenses} setActiveTab={setActiveTab} />;
            case 'products': return <ProductsPage products={products} handleDeleteProduct={handleDeleteProduct} openModal={t => setModal(t)} handleBulkUpload={handleBulkUpload} uploadingBulk={uploadingBulk} />;
            case 'sales': return <SalesPage sales={sales} openModal={t => setModal(t)} handleDeleteSale={handleDeleteSale} />;
            case 'credit': return <CreditPage credit={credit} openModal={t => setModal(t)} handleDeleteCredit={handleDeleteCredit} handleRecordPayment={handleRecordPayment} />;
            case 'expenses': return <ExpensesPage expenses={expenses} openModal={t => setModal(t)} handleDeleteExpense={handleDeleteExpense} />;
            case 'messages': return <MessagesPage credit={credit} sales={sales} />;
            case 'inquiries': return <InquiriesPage />;
            case 'hero': return (
                <div>
                    <PageHeader eyebrow="Website" title="Hero Slides"
                        action={<button style={btnPrimary} onClick={() => setModal('hero_slide')}><IconPlus /> Add Slide</button>}
                    />
                    <div style={cardStyle}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                                <thead><tr style={{ background: COLORS.surface2 }}>
                                    <th style={thStyle}>Image</th><th style={thStyle}>Title</th><th style={thStyle}>Subtitle</th><th style={thStyle}>Description</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {heroSlides.length === 0 && <tr><td colSpan={5}><EmptyRow text="No hero slides found." /></td></tr>}
                                    {heroSlides.map(slide => (
                                        <tr key={slide.id}>
                                            <td style={tdStyle}><img src={slide.image} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="" /></td>
                                            <td style={{ ...tdStyle, fontWeight: 500 }}>{slide.title}</td>
                                            <td style={{ ...tdStyle, color: COLORS.muted }}>{slide.subtitle}</td>
                                            <td style={{ ...tdStyle, fontSize: 13 }}>{slide.description}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <button style={{ ...iconBtnStyle, color: COLORS.rust }} onClick={async () => {
                                                    if(!confirm('Delete this slide?')) return;
                                                    await supabase.from('hero_slides').delete().eq('id', slide.id);
                                                    setHeroSlides(prev => prev.filter(h => h.id !== slide.id));
                                                }}><IconTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <div style={{ display: 'flex', height: '100vh', fontFamily: fontBody, background: COLORS.bg, overflow: 'hidden' }}>
                <Sidebar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Top bar */}
                    <header style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, height: 60 }}>
                        <button onClick={() => setSidebarOpen(o => !o)} style={{ ...iconBtnStyle, background: COLORS.surface2, borderRadius: 8, padding: 7 }}><IconMenu /></button>
                        <span style={{ fontSize: 13, color: COLORS.muted, flex: 1, fontWeight: 500 }}>Luxe Craft Furniture — Admin Console</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 11, fontFamily: fontMono, color: COLORS.muted, letterSpacing: '0.05em' }}>{new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.goldBright}, ${COLORS.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>B</div>
                        </div>
                    </header>
                    {/* Content */}
                    <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
                        {renderPage()}
                    </main>
                </div>

                {/* ---- Modals ---- */}
                {modal === 'product' && <Modal title="Add Product" onClose={() => setModal(null)}><ProductForm onSubmit={handleSaveProduct} onCancel={() => setModal(null)} /></Modal>}
                {modal?.type === 'edit_product' && <Modal title="Edit Product" onClose={() => setModal(null)}><ProductForm onSubmit={handleSaveProduct} onCancel={() => setModal(null)} initialData={modal.product} /></Modal>}
                {modal === 'sale' && <Modal title="Record Sale" onClose={() => setModal(null)}><SaleForm onSubmit={handleSaveSale} onCancel={() => setModal(null)} /></Modal>}
                {modal === 'credit' && <Modal title="New Credit Sale" onClose={() => setModal(null)}><CreditForm onSubmit={handleSaveCredit} onCancel={() => setModal(null)} /></Modal>}
                {modal === 'expense' && <Modal title="Record Expense" onClose={() => setModal(null)}><ExpenseForm onSubmit={handleSaveExpense} onCancel={() => setModal(null)} /></Modal>}
                {modal?.type === 'payment' && <Modal title="Record Payment" onClose={() => setModal(null)}><PaymentForm record={modal.record} onSubmit={handleSavePayment} onCancel={() => setModal(null)} /></Modal>}
                {modal === 'hero_slide' && (
                    <Modal title="Add Hero Slide" onClose={() => setModal(null)}>
                        <HeroSlideForm onClose={() => setModal(null)} onSave={async (data) => {
                            const { data: saved, error } = await supabase.from('hero_slides').insert(data).select().single();
                            if (error) { toast.error(error.message); return; }
                            setHeroSlides(prev => [saved, ...prev]);
                            toast.success('Slide added!');
                            setModal(null);
                        }} />
                    </Modal>
                )}
            </div>
        </>
    );
}
