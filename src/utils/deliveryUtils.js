/**
 * deliveryUtils.js
 * Pure, testable delivery fee calculation functions for Luxe Craft Furniture.
 * No API calls — all math is local. Road distances come from routing.js and
 * are passed in; when they are unavailable we fall back to straight-line maths.
 */

// Vite exposes env vars on import.meta.env; guard so this module also loads in Node (tests).
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

// ─── Pricing defaults ───────────────────────────────────────────────────────
// Live values come from the `delivery_settings` table (see useDeliverySettings).
// These are only used if that fetch fails.
export const DEFAULT_FREE_RADIUS_KM = 10;
export const DEFAULT_RATE_PER_KM = 200; // KES per km beyond the free radius

/**
 * When road routing is unavailable we only have the straight-line distance,
 * which under-states the real trip. Nairobi-area roads typically run 1.2–1.4×
 * the straight-line distance, so the fallback scales by this factor and the
 * quote is flagged as an estimate.
 */
export const FALLBACK_ROAD_FACTOR = 1.3;

// ─── Branch definitions ─────────────────────────────────────────────────────
// Coordinates match the branch pins linked from the Contact page.
// Override via env vars if a branch moves.
export const BRANCHES = [
    {
        name: 'Whitehouse Footbridge, Tena Estate',
        shortName: 'Whitehouse – Tena',
        lat: Number(env.VITE_BRANCH_WHITEHOUSE_LAT ?? -1.2922833),
        lng: Number(env.VITE_BRANCH_WHITEHOUSE_LNG ?? 36.8859225),
        primary: true,
    },
    {
        name: 'Kyumvi, Mombasa Road (Machakos Junction)',
        shortName: 'Kyumvi – Machakos',
        lat: Number(env.VITE_BRANCH_KYUMVI_LAT ?? -1.5303409),
        lng: Number(env.VITE_BRANCH_KYUMVI_LNG ?? 37.1288169),
        primary: false,
    },
];

// ─── Haversine distance ──────────────────────────────────────────────────────
/**
 * Straight-line distance between two GPS coordinates (in km).
 * Haversine formula — accurate to ~0.5% for distances under 500 km.
 *
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} Distance in km (float)
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371.0088; // mean Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const round1 = (n) => Math.round(n * 10) / 10;

// ─── Fee calculation ─────────────────────────────────────────────────────────
/**
 * Calculates the delivery fee for a given distance.
 *
 * Rules:
 *  - Distance is kept to 0.1 km precision (no rounding up to whole km)
 *  - Free when the distance is within freeRadiusKm
 *  - Beyond that: ratePerKm × every km (and fraction) OVER the free radius
 *  - Final fee rounded to the nearest 10 KES
 *
 * @param {number} distanceKm      Distance in km (float)
 * @param {number} freeRadiusKm    Default: 10
 * @param {number} ratePerKm       Default: 200
 * @returns {{ distanceKm: number, billableKm: number, fee: number, isFree: boolean }}
 *
 * Examples (free radius 10, rate 200):
 *   calculateDeliveryFee(5)     → { distanceKm: 5,    billableKm: 0,   fee: 0,    isFree: true  }
 *   calculateDeliveryFee(10)    → { distanceKm: 10,   billableKm: 0,   fee: 0,    isFree: true  }
 *   calculateDeliveryFee(10.2)  → { distanceKm: 10.2, billableKm: 0.2, fee: 40,   isFree: false }
 *   calculateDeliveryFee(12)    → { distanceKm: 12,   billableKm: 2,   fee: 400,  isFree: false }
 *   calculateDeliveryFee(15.37) → { distanceKm: 15.4, billableKm: 5.4, fee: 1080, isFree: false }
 */
export function calculateDeliveryFee(
    distanceKm,
    freeRadiusKm = DEFAULT_FREE_RADIUS_KM,
    ratePerKm = DEFAULT_RATE_PER_KM,
) {
    const distance = round1(Math.max(0, Number(distanceKm) || 0));
    const freeRadius = Math.max(0, Number(freeRadiusKm) || 0);
    const rate = Math.max(0, Number(ratePerKm) || 0);

    if (distance <= freeRadius) {
        return { distanceKm: distance, billableKm: 0, fee: 0, isFree: true };
    }

    const billableKm = round1(distance - freeRadius);
    const fee = Math.round((billableKm * rate) / 10) * 10; // nearest 10 KES

    return { distanceKm: distance, billableKm, fee, isFree: fee === 0 };
}

// ─── Full delivery quote ─────────────────────────────────────────────────────
/**
 * Finds the nearest branch to the customer and returns a complete delivery quote.
 *
 * Pass `roadDistancesKm` (one entry per branch, in the same order; null where
 * routing failed) to price on real driving distance. Branches without a road
 * distance fall back to straight-line × FALLBACK_ROAD_FACTOR.
 *
 * @param {number} customerLat
 * @param {number} customerLng
 * @param {Array<{ name: string, shortName?: string, lat: number, lng: number }>} branches
 * @param {number} freeRadiusKm
 * @param {number} ratePerKm
 * @param {Array<number|null>|null} roadDistancesKm
 * @returns {{
 *   nearestBranch: object,
 *   straightLineKm: number,
 *   rawDistanceKm: number,
 *   distanceKm: number,
 *   billableKm: number,
 *   fee: number,
 *   isFree: boolean,
 *   distanceSource: 'road' | 'estimate',
 *   freeRadiusKm: number,
 *   ratePerKm: number,
 *   customerLat: number,
 *   customerLng: number,
 * }}
 */
export function getDeliveryQuote(
    customerLat,
    customerLng,
    branches = BRANCHES,
    freeRadiusKm = DEFAULT_FREE_RADIUS_KM,
    ratePerKm = DEFAULT_RATE_PER_KM,
    roadDistancesKm = null,
) {
    if (!branches || branches.length === 0) {
        throw new Error('No branches configured.');
    }

    let nearest = null;

    branches.forEach((branch, i) => {
        const straightLineKm = getDistanceKm(customerLat, customerLng, Number(branch.lat), Number(branch.lng));
        const road = Array.isArray(roadDistancesKm) ? roadDistancesKm[i] : null;
        const hasRoad = typeof road === 'number' && Number.isFinite(road) && road >= 0;

        const effectiveKm = hasRoad ? road : straightLineKm * FALLBACK_ROAD_FACTOR;

        if (!nearest || effectiveKm < nearest.effectiveKm) {
            nearest = {
                branch,
                straightLineKm,
                effectiveKm,
                source: hasRoad ? 'road' : 'estimate',
            };
        }
    });

    const { distanceKm, billableKm, fee, isFree } = calculateDeliveryFee(
        nearest.effectiveKm,
        freeRadiusKm,
        ratePerKm,
    );

    return {
        nearestBranch: nearest.branch,
        straightLineKm: round1(nearest.straightLineKm),
        rawDistanceKm: nearest.effectiveKm,
        distanceKm,
        billableKm,
        fee,
        isFree,
        distanceSource: nearest.source,
        freeRadiusKm: Number(freeRadiusKm),
        ratePerKm: Number(ratePerKm),
        // Customer GPS — used to build a Google Maps pin link in the WhatsApp message
        customerLat,
        customerLng,
    };
}
