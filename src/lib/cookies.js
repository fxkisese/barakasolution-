/**
 * cookies.js — lightweight cookie read/write helpers for Baraka Solutions.
 *
 * Consent cookie structure (JSON, stored under CONSENT_COOKIE_NAME):
 *   { analytics: boolean, advertising: boolean, version: number }
 *
 * "Necessary" cookies are always on and are never stored in the consent cookie —
 * they just exist as part of normal site operation (auth session, cart state, etc.)
 */

export const CONSENT_COOKIE_NAME = 'baraka_cookie_consent';
const CONSENT_VERSION = 1;
const CONSENT_EXPIRY_DAYS = 180;

/** Set a cookie with an optional expiry in days. */
export function setCookie(name, value, days = 0) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

/** Read a single cookie by name. Returns the value string or null. */
export function getCookie(name) {
    const key = encodeURIComponent(name) + '=';
    for (const part of document.cookie.split(';')) {
        const trimmed = part.trimStart();
        if (trimmed.startsWith(key)) {
            return decodeURIComponent(trimmed.slice(key.length));
        }
    }
    return null;
}

/** Delete a cookie by setting its expiry to the past. */
export function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

/**
 * Get the current consent state.
 * Returns `null` if the visitor hasn't made a choice yet.
 * Returns `{ analytics: bool, advertising: bool }` if they have.
 */
export function getConsent() {
    const raw = getCookie(CONSENT_COOKIE_NAME);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        // Ignore cookies from an older schema version
        if (parsed.version !== CONSENT_VERSION) return null;
        return {
            analytics: Boolean(parsed.analytics),
            advertising: Boolean(parsed.advertising),
        };
    } catch {
        return null;
    }
}

/**
 * Persist the visitor's consent choice.
 * @param {{ analytics: boolean, advertising: boolean }} prefs
 */
export function setConsent(prefs) {
    const payload = {
        analytics: Boolean(prefs.analytics),
        advertising: Boolean(prefs.advertising),
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
    };
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(payload), CONSENT_EXPIRY_DAYS);
}

/** Accept all cookie categories. */
export function acceptAll() {
    setConsent({ analytics: true, advertising: true });
}

/** Accept only necessary cookies (reject optional ones). */
export function rejectAll() {
    setConsent({ analytics: false, advertising: false });
}
