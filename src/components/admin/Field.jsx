import { Label } from "@/components/ui/label";

export default function Field({ label, children }) {
    return (
        <div>
            <Label className="text-xs text-[#5F6368] uppercase tracking-wide">{label}</Label>
            <div className="mt-1.5">{children}</div>
        </div>
    );
}