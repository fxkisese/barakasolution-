import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, Shield, BarChart2, Target, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useCookies } from "@/lib/CookieContext";

/* ─── Category definitions ──────────────────────────────────────── */
const CATEGORIES = [
    {
        id: "necessary",
        icon: Lock,
        label: "Necessary",
        description:
            "Required for the website to work correctly. Includes your shopping cart, login session, and security cookies. These cannot be disabled.",
        always: true,
    },
    {
        id: "analytics",
        icon: BarChart2,
        label: "Analytics",
        description:
            "Help us understand how visitors use the site — which pages are popular, where people drop off, and how to improve the experience. Powered by Google Analytics 4.",
        always: false,
    },
    {
        id: "advertising",
        icon: Target,
        label: "Advertising",
        description:
            "Help measure whether our Facebook and Instagram ads led to actions on this website (e.g. viewing a product or placing an order). Powered by Meta Pixel.",
        always: false,
    },
];

/* ─── Toggle pill ───────────────────────────────────────────────── */
function Toggle({ enabled, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-obsidian ${
                disabled
                    ? "border-stone-300 bg-stone-200 cursor-not-allowed"
                    : enabled
                    ? "border-obsidian bg-obsidian"
                    : "border-stone-300 bg-stone-100 cursor-pointer"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    enabled ? "translate-x-5" : "translate-x-0.5"
                } mt-[1px]`}
            />
        </button>
    );
}

/* ─── Main banner ───────────────────────────────────────────────── */
export default function CookieBanner() {
    const { showBanner, acceptAllCookies, rejectAllCookies, saveConsent } = useCookies();

    const [panelOpen, setPanelOpen] = useState(false);
    const [prefs, setPrefs] = useState({ analytics: false, advertising: false });
    const [expandedId, setExpandedId] = useState(null);

    const toggleCategory = (id, val) => setPrefs((p) => ({ ...p, [id]: val }));
    const toggleExpanded = (id) => setExpandedId((prev) => (prev === id ? null : id));

    const handleSavePrefs = () => saveConsent(prefs);

    return (
        <AnimatePresence>
            {showBanner && (
                <>
                    {/* ── Backdrop (subtle) ── */}
                    <motion.div
                        key="cookie-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[800] bg-obsidian/30 backdrop-blur-[1px] pointer-events-none"
                        aria-hidden="true"
                    />

                    {/* ── Banner ── */}
                    <motion.div
                        key="cookie-banner"
                        role="dialog"
                        aria-modal="false"
                        aria-label="Cookie consent"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-0 inset-x-0 z-[801] bg-white border-t border-stone-200 shadow-2xl"
                    >
                        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
                            {/* ── Collapsed state ── */}
                            <AnimatePresence mode="wait">
                                {!panelOpen ? (
                                    <motion.div
                                        key="collapsed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                    >
                                        {/* Icon + text */}
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="shrink-0 w-9 h-9 rounded-full bg-obsidian flex items-center justify-center mt-0.5">
                                                <Shield className="w-4 h-4 text-amber-300" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-obsidian text-sm font-semibold leading-snug">
                                                    We use cookies to improve your experience
                                                </p>
                                                <p className="mt-0.5 text-stone-500 text-xs leading-relaxed">
                                                    We use cookies to keep the website working, understand how visitors use it, and improve our advertising.{" "}
                                                    <Link to="/cookies" className="underline underline-offset-2 hover:text-obsidian transition-colors">
                                                        Cookie Policy
                                                    </Link>
                                                    {" "}·{" "}
                                                    <Link to="/privacy" className="underline underline-offset-2 hover:text-obsidian transition-colors">
                                                        Privacy Policy
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                                            <button
                                                id="cookie-manage-btn"
                                                onClick={() => setPanelOpen(true)}
                                                className="inline-flex items-center gap-1.5 h-9 px-4 border border-stone-300 text-obsidian text-[11px] uppercase tracking-[0.15em] hover:border-obsidian transition-colors"
                                            >
                                                Manage
                                                <ChevronUp className="w-3 h-3" />
                                            </button>
                                            <button
                                                id="cookie-reject-btn"
                                                onClick={rejectAllCookies}
                                                className="inline-flex items-center h-9 px-4 border border-stone-300 text-stone-600 text-[11px] uppercase tracking-[0.15em] hover:border-obsidian hover:text-obsidian transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                id="cookie-accept-btn"
                                                onClick={acceptAllCookies}
                                                className="inline-flex items-center h-9 px-5 bg-obsidian text-silk text-[11px] uppercase tracking-[0.15em] hover:bg-stone-800 transition-colors"
                                            >
                                                Accept All
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* ── Expanded preferences panel ── */
                                    <motion.div
                                        key="expanded"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-5"
                                    >
                                        {/* Panel header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-obsidian" strokeWidth={1.5} />
                                                <h2 className="text-obsidian font-semibold text-sm tracking-wide">
                                                    Cookie Preferences
                                                </h2>
                                            </div>
                                            <button
                                                id="cookie-panel-close-btn"
                                                onClick={() => setPanelOpen(false)}
                                                aria-label="Close preferences panel"
                                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-obsidian transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Categories */}
                                        <div className="grid sm:grid-cols-3 gap-3 mb-5">
                                            {CATEGORIES.map(({ id, icon: Icon, label, description, always }) => {
                                                const isOn = always || prefs[id];
                                                const isExpanded = expandedId === id;
                                                return (
                                                    <div
                                                        key={id}
                                                        className={`border rounded-sm p-3 transition-colors ${
                                                            isOn ? "border-obsidian/30 bg-stone-50" : "border-stone-200"
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                                    isOn ? "bg-obsidian" : "bg-stone-100"
                                                                }`}>
                                                                    <Icon
                                                                        className={`w-3.5 h-3.5 ${isOn ? "text-amber-300" : "text-stone-400"}`}
                                                                        strokeWidth={1.5}
                                                                    />
                                                                </div>
                                                                <span className="text-obsidian text-[12px] font-semibold">
                                                                    {label}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {always && (
                                                                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-medium">
                                                                        Always on
                                                                    </span>
                                                                )}
                                                                <Toggle
                                                                    enabled={isOn}
                                                                    onChange={(v) => toggleCategory(id, v)}
                                                                    disabled={always}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Expandable description */}
                                                        <button
                                                            onClick={() => toggleExpanded(id)}
                                                            className="mt-2 flex items-center gap-1 text-[10px] text-stone-400 hover:text-obsidian transition-colors"
                                                        >
                                                            {isExpanded ? "Less" : "Details"}
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-3 h-3" />
                                                            ) : (
                                                                <ChevronDown className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.p
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden text-[11px] text-stone-500 leading-relaxed mt-1"
                                                                >
                                                                    {description}
                                                                </motion.p>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Panel footer actions */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                                            <p className="text-stone-400 text-[10px]">
                                                <Link to="/cookies" className="underline underline-offset-2 hover:text-obsidian transition-colors">
                                                    Cookie Policy
                                                </Link>
                                                {" · "}
                                                <Link to="/privacy" className="underline underline-offset-2 hover:text-obsidian transition-colors">
                                                    Privacy Policy
                                                </Link>
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    id="cookie-save-prefs-btn"
                                                    onClick={handleSavePrefs}
                                                    className="h-9 px-5 border border-obsidian text-obsidian text-[11px] uppercase tracking-[0.15em] hover:bg-stone-50 transition-colors"
                                                >
                                                    Save Preferences
                                                </button>
                                                <button
                                                    id="cookie-accept-all-btn"
                                                    onClick={acceptAllCookies}
                                                    className="h-9 px-5 bg-obsidian text-silk text-[11px] uppercase tracking-[0.15em] hover:bg-stone-800 transition-colors"
                                                >
                                                    Accept All
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
