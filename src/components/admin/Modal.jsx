import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl text-[#1A1A1A]">{title}</h3>
                    <button onClick={onClose} className="text-[#5F6368] hover:text-[#1A1A1A]">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}