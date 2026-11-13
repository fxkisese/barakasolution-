import { useEffect, useState } from "react";
import { Plus, Trash2, Save, MapPin } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Field from "@/components/admin/Field";
import {
    BRANCHES,
    DEFAULT_FREE_RADIUS_KM,
    DEFAULT_RATE_PER_KM,
    calculateDeliveryFee,
} from "@/utils/deliveryUtils";

const emptyBranch = { name: "", shortName: "", lat: "", lng: "", primary: false };

/**
 * Admin screen for the `delivery_settings` row: free radius, rate per km and
 * the branch pins that distances are measured from. The storefront reads the
 * same row on every checkout, so changes take effect immediately.
 */
export default function DeliverySettings() {
    const { toast } = useToast();
    const [rowId, setRowId] = useState(null);
    const [freeRadiusKm, setFreeRadiusKm] = useState(DEFAULT_FREE_RADIUS_KM);
    const [ratePerKm, setRatePerKm] = useState(DEFAULT_RATE_PER_KM);
    const [branches, setBranches] = useState(BRANCHES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sampleKm, setSampleKm] = useState(15);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const { data, error } = await supabase
                .from("delivery_settings")
                .select("*")
                .limit(1)
                .maybeSingle();
            if (cancelled) return;
            if (!error && data) {
                setRowId(data.id);
                setFreeRadiusKm(Number(data.free_radius_km));
                setRatePerKm(Number(data.rate_per_km));
                if (Array.isArray(data.branch_locations) && data.branch_locations.length > 0) {
                    setBranches(data.branch_locations);
                }
            }
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, []);

    const updateBranch = (i, patch) =>
        setBranches((arr) => arr.map((b, j) => (j === i ? { ...b, ...patch } : b)));
    const setPrimary = (i) =>
        setBranches((arr) => arr.map((b, j) => ({ ...b, primary: j === i })));
    const addBranch = () => setBranches((arr) => [...arr, { ...emptyBranch }]);
    const removeBranch = (i) => setBranches((arr) => arr.filter((_, j) => j !== i));

    const save = async () => {
        const cleaned = branches.map((b) => ({
            name: String(b.name || "").trim(),
            shortName: String(b.shortName || b.name || "").trim(),
            lat: Number(b.lat),
            lng: Number(b.lng),
            primary: !!b.primary,
        }));
        const invalid = cleaned.find(
            (b) => !b.name || !Number.isFinite(b.lat) || !Number.isFinite(b.lng) || Math.abs(b.lat) > 90 || Math.abs(b.lng) > 180,
        );
        if (cleaned.length === 0 || invalid) {
            toast({
                title: "Check branch details",
                description: "Every branch needs a name and a valid latitude and longitude.",
                variant: "destructive",
            });
            return;
        }
        if (!cleaned.some((b) => b.primary)) cleaned[0].primary = true;

        const payload = {
            free_radius_km: Math.max(0, Number(freeRadiusKm) || 0),
            rate_per_km: Math.max(0, Number(ratePerKm) || 0),
            branch_locations: cleaned,
        };

        setSaving(true);
        const query = rowId
            ? supabase.from("delivery_settings").update(payload).eq("id", rowId).select("id").single()
            : supabase.from("delivery_settings").insert(payload).select("id").single();
        const { data, error } = await query;
        setSaving(false);

        if (error) {
            toast({ title: "Failed to save", description: error.message, variant: "destructive" });
            return;
        }
        if (data?.id) setRowId(data.id);
        setBranches(cleaned);
        toast({ title: "Delivery settings saved", description: "New quotes use these values immediately." });
    };

    const sample = calculateDeliveryFee(Number(sampleKm) || 0, Number(freeRadiusKm) || 0, Number(ratePerKm) || 0);

    return (
        <div className="p-8">
            <AdminPageHeader
                title="Delivery Pricing"
                subtitle="Free radius, per-kilometre rate and the branch locations distances are measured from"
                action={
                    <Button onClick={save} disabled={saving || loading} className="bg-[#1A1A1A] text-white hover:opacity-90">
                        <Save className="w-4 h-4 mr-2" /> {saving ? "Saving…" : "Save Changes"}
                    </Button>
                }
            />

            {loading ? (
                <div className="text-center text-[#5F6368] py-10">Loading…</div>
            ) : (
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Pricing */}
                    <div className="bg-white border border-[#EAEBED] rounded-xl p-6 space-y-5">
                        <h3 className="font-semibold text-[#1A1A1A]">Pricing rules</h3>
                        <Field label="Free delivery radius (km)">
                            <Input type="number" min="0" step="0.5" value={freeRadiusKm} onChange={(e) => setFreeRadiusKm(e.target.value)} />
                        </Field>
                        <Field label="Rate per km beyond the free radius (KES)">
                            <Input type="number" min="0" step="10" value={ratePerKm} onChange={(e) => setRatePerKm(e.target.value)} />
                        </Field>

                        <div className="border-t border-[#EAEBED] pt-4">
                            <Field label="Preview: customer this many km from the nearest branch">
                                <Input type="number" min="0" step="0.5" value={sampleKm} onChange={(e) => setSampleKm(e.target.value)} />
                            </Field>
                            <p className="mt-3 text-sm text-[#5F6368]">
                                {sample.isFree ? (
                                    <>Delivery is <span className="font-semibold text-green-700">free</span>.</>
                                ) : (
                                    <>
                                        Fee <span className="font-semibold text-[#1A1A1A]">KES {sample.fee.toLocaleString()}</span>
                                        {" "}({sample.billableKm} km × KES {Number(ratePerKm) || 0})
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Branches */}
                    <div className="lg:col-span-2 bg-white border border-[#EAEBED] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-[#1A1A1A]">Branch locations</h3>
                            <Button variant="outline" onClick={addBranch}>
                                <Plus className="w-4 h-4 mr-2" /> Add Branch
                            </Button>
                        </div>
                        <p className="text-xs text-[#5F6368] mb-5 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            To get coordinates, right-click the exact spot in Google Maps and copy the two numbers shown (latitude first).
                            Quotes are measured from whichever branch is closest by road.
                        </p>

                        <div className="space-y-4">
                            {branches.map((b, i) => (
                                <div key={i} className="border border-[#EAEBED] rounded-lg p-4 grid gap-3 md:grid-cols-12 items-end">
                                    <div className="md:col-span-4">
                                        <Field label="Branch name">
                                            <Input value={b.name} onChange={(e) => updateBranch(i, { name: e.target.value })} placeholder="Whitehouse Footbridge, Tena Estate" />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-3">
                                        <Field label="Short label">
                                            <Input value={b.shortName || ""} onChange={(e) => updateBranch(i, { shortName: e.target.value })} placeholder="Whitehouse – Tena" />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field label="Latitude">
                                            <Input type="number" step="0.0000001" value={b.lat} onChange={(e) => updateBranch(i, { lat: e.target.value })} placeholder="-1.2922833" />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field label="Longitude">
                                            <Input type="number" step="0.0000001" value={b.lng} onChange={(e) => updateBranch(i, { lng: e.target.value })} placeholder="36.8859225" />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-1 flex md:flex-col gap-2 items-center justify-end">
                                        <label className="flex items-center gap-1.5 text-xs text-[#5F6368] whitespace-nowrap cursor-pointer">
                                            <input type="radio" name="primary-branch" checked={!!b.primary} onChange={() => setPrimary(i)} />
                                            Main
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeBranch(i)}
                                            disabled={branches.length <= 1}
                                            title="Remove branch"
                                            className="text-[#5F6368] hover:text-red-600 disabled:opacity-30"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
