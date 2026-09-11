import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getConsent, setConsent, acceptAll, rejectAll } from '@/lib/cookies';

/**
 * CookieContext — manages consent state for the entire app.
 *
 * Consumers get:
 *   consent        — { analytics: bool, advertising: bool } | null (null = not decided yet)
 *   showBanner     — bool: true if the banner should be visible
 *   openPreferences— () => void: re-open the banner/preferences panel from anywhere (e.g. footer link)
 *   saveConsent    — ({ analytics, advertising }) => void
 *   acceptAllCookies  — () => void
 *   rejectAllCookies  — () => void
 */

const CookieContext = createContext(null);

/* ─── gtag consent-mode helper ─────────────────────────────────── */
function updateGtagConsent(prefs) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
        analytics_storage: prefs?.analytics ? 'granted' : 'denied',
        ad_storage: prefs?.advertising ? 'granted' : 'denied',
        ad_user_data: prefs?.advertising ? 'granted' : 'denied',
        ad_personalization: prefs?.advertising ? 'granted' : 'denied',
    });
}

/* ─── Meta Pixel loader ─────────────────────────────────────────── */
let pixelLoaded = false;
function loadMetaPixel(pixelId) {
    if (pixelLoaded || !pixelId || typeof window === 'undefined') return;
    pixelLoaded = true;

    /* standard Meta Pixel snippet (condensed) */
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
}

/* ─── Provider ──────────────────────────────────────────────────── */
export function CookieProvider({ children }) {
    const [consent, setConsentState] = useState(() => getConsent()); // null | { analytics, advertising }
    const [showBanner, setShowBanner] = useState(false);

    // Show banner on mount if user hasn't decided yet
    useEffect(() => {
        if (getConsent() === null) {
            // Small delay so the page loads first
            const t = setTimeout(() => setShowBanner(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    // Sync gtag + Meta Pixel whenever consent changes
    useEffect(() => {
        updateGtagConsent(consent);

        const pixelId = import.meta.env.VITE_META_PIXEL_ID;
        if (consent?.advertising && pixelId) {
            loadMetaPixel(pixelId);
        }
    }, [consent]);

    const saveConsentPrefs = useCallback((prefs) => {
        setConsent(prefs);
        setConsentState(prefs);
        setShowBanner(false);
        updateGtagConsent(prefs);

        const pixelId = import.meta.env.VITE_META_PIXEL_ID;
        if (prefs.advertising && pixelId) {
            loadMetaPixel(pixelId);
        }
    }, []);

    const acceptAllCookies = useCallback(() => {
        acceptAll();
        const prefs = { analytics: true, advertising: true };
        setConsentState(prefs);
        setShowBanner(false);
        updateGtagConsent(prefs);

        const pixelId = import.meta.env.VITE_META_PIXEL_ID;
        if (pixelId) loadMetaPixel(pixelId);
    }, []);

    const rejectAllCookies = useCallback(() => {
        rejectAll();
        const prefs = { analytics: false, advertising: false };
        setConsentState(prefs);
        setShowBanner(false);
        updateGtagConsent(prefs);
    }, []);

    const openPreferences = useCallback(() => {
        setShowBanner(true);
    }, []);

    return (
        <CookieContext.Provider value={{
            consent,
            showBanner,
            openPreferences,
            saveConsent: saveConsentPrefs,
            acceptAllCookies,
            rejectAllCookies,
        }}>
            {children}
        </CookieContext.Provider>
    );
}

export function useCookies() {
    const ctx = useContext(CookieContext);
    if (!ctx) throw new Error('useCookies must be used inside <CookieProvider>');
    return ctx;
}
