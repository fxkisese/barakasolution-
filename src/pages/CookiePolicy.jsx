import { Link } from "react-router-dom";
import { useCookies } from "@/lib/CookieContext";
import { Settings } from "lucide-react";

const COOKIE_TABLE = [
    {
        name: "baraka_cookie_consent",
        provider: "Baraka Solutions",
        purpose: "Stores your cookie consent preferences so you are not asked again on every visit.",
        type: "Necessary",
        duration: "180 days",
    },
    {
        name: "sb-*-auth-token",
        provider: "Supabase",
        purpose: "Keeps you signed in to your account across pages and browser sessions.",
        type: "Necessary",
        duration: "Session / 1 week",
    },
    {
        name: "_ga, _ga_*",
        provider: "Google Analytics 4",
        purpose: "Distinguishes individual users and sessions. Used to count visits and page views so we understand how the site is used.",
        type: "Analytics",
        duration: "2 years",
    },
    {
        name: "_fbp",
        provider: "Meta (Facebook/Instagram)",
        purpose: "Identifies browsers for ad attribution — helps us measure whether a Meta ad led to an action on this site.",
        type: "Advertising",
        duration: "90 days",
    },
    {
        name: "_fbc",
        provider: "Meta (Facebook/Instagram)",
        purpose: "Stores a click ID from a Meta ad so we can attribute conversions back to specific ad campaigns.",
        type: "Advertising",
        duration: "90 days",
    },
];

const TYPE_STYLES = {
    Necessary:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Analytics:   "bg-blue-50 text-blue-700 border border-blue-200",
    Advertising: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function CookiePolicy() {
    const { openPreferences } = useCookies();

    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3">Legal</p>
                <h1 className="font-heading font-light text-[clamp(2rem,4vw,3rem)] text-obsidian leading-tight">
                    Cookie Policy
                </h1>
                <p className="mt-4 text-stone-500 text-sm">Last updated: September 2026</p>
                <div className="mt-6 h-px w-16 bg-obsidian/20" />
            </div>

            <div className="prose-style space-y-10 text-stone-600">

                {/* Intro */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">What are cookies?</h2>
                    <p className="leading-relaxed text-sm">
                        Cookies are small text files placed in your browser by websites you visit. They are widely used to make websites work efficiently, to remember your preferences, and to provide information to the owners of the site. Cookies do not give us access to your device or any information beyond what you choose to share with us.
                    </p>
                </section>

                {/* How we use cookies */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">How we use cookies</h2>
                    <p className="leading-relaxed text-sm mb-4">
                        Baraka Solutions uses cookies for three purposes:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            {
                                type: "Necessary",
                                style: TYPE_STYLES.Necessary,
                                desc: "Essential for the website to function correctly — your shopping cart, login session, and your consent preferences. You cannot opt out of these.",
                            },
                            {
                                type: "Analytics",
                                style: TYPE_STYLES.Analytics,
                                desc: "Help us understand how visitors use the site — which pages are popular and where we can improve. Powered by Google Analytics 4.",
                            },
                            {
                                type: "Advertising",
                                style: TYPE_STYLES.Advertising,
                                desc: "Help measure whether our Facebook and Instagram ads led to actions on this website. Powered by Meta Pixel.",
                            },
                        ].map(({ type, style, desc }) => (
                            <div key={type} className="border border-stone-200 rounded-sm p-4">
                                <span className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full mb-2 ${style}`}>
                                    {type}
                                </span>
                                <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cookie table */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-4">Cookies we use</h2>
                    <div className="overflow-x-auto border border-stone-200 rounded-sm">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    {["Cookie name", "Provider", "Purpose", "Type", "Duration"].map(h => (
                                        <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-wider text-stone-500 font-semibold whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {COOKIE_TABLE.map((row) => (
                                    <tr key={row.name} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-[11px] text-obsidian whitespace-nowrap">{row.name}</td>
                                        <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{row.provider}</td>
                                        <td className="px-4 py-3 text-stone-500 leading-relaxed max-w-xs">{row.purpose}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${TYPE_STYLES[row.type]}`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{row.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Third-party */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">Third-party services</h2>
                    <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-stone-200 pl-4">
                            <p className="font-semibold text-obsidian">Google Analytics 4</p>
                            <p className="text-stone-500 mt-1 leading-relaxed">
                                We use Google Analytics to understand how visitors interact with our website. Google may transfer data to servers in the United States and other countries. For more information, see{" "}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-obsidian hover:text-stone-600">
                                    Google's Privacy Policy
                                </a>.
                            </p>
                        </div>
                        <div className="border-l-2 border-stone-200 pl-4">
                            <p className="font-semibold text-obsidian">Meta Pixel (Facebook/Instagram)</p>
                            <p className="text-stone-500 mt-1 leading-relaxed">
                                We use Meta Pixel to measure the effectiveness of our advertising campaigns on Facebook and Instagram. For more information, see{" "}
                                <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-obsidian hover:text-stone-600">
                                    Meta's Privacy Policy
                                </a>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Managing preferences */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">Managing your preferences</h2>
                    <p className="text-sm leading-relaxed mb-4">
                        You can change your cookie preferences at any time. Only necessary cookies will be placed if you choose to reject optional cookies — this will not affect the core functionality of the site.
                    </p>
                    <button
                        id="cookie-policy-manage-btn"
                        onClick={openPreferences}
                        className="inline-flex items-center gap-2 h-11 px-6 border border-obsidian text-obsidian text-[11px] uppercase tracking-[0.18em] hover:bg-obsidian hover:text-white transition-colors duration-200"
                    >
                        <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Manage Cookie Preferences
                    </button>
                    <p className="mt-4 text-xs text-stone-400">
                        You can also control cookies through your browser settings. Note that blocking all cookies may affect site functionality.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="font-heading text-xl text-obsidian mb-3">Contact us</h2>
                    <p className="text-sm leading-relaxed">
                        If you have questions about our use of cookies, please visit our{" "}
                        <Link to="/contact" className="underline underline-offset-2 text-obsidian hover:text-stone-600">
                            Contact page
                        </Link>{" "}
                        or read our full{" "}
                        <Link to="/privacy" className="underline underline-offset-2 text-obsidian hover:text-stone-600">
                            Privacy Policy
                        </Link>.
                    </p>
                </section>
            </div>
        </div>
    );
}
