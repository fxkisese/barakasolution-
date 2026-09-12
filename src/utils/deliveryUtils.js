/**
 * deliveryUtils.js
 * Pure, testable delivery fee calculation functions for Baraka Solutions.
 * No API calls — all math is local.
 */

// ─── Branch definitions ─────────────────────────────────────────────────────
// Coordinates read from env vars so they can be updated without redeploying.
// Fallback values are close approximations — update .env.local with exact coords.
export const BRANCHES = [
    {
        name: 'Whitehouse Footbridge, Tena Estate',
        shortName: 'Whitehouse – Tena',
        lat: Number(import.meta.env.VITE_BRANCH_WHITEHOUSE_LAT ?? -1.3040),
        lng: Number(import.meta.env.VITE_BRANCH_WHITEHOUSE_LNG ?? 36.8695),
        primary: true,
    },
    {
        name: 'Kyumbi / Machakos Junction',
        shortName: 'Kyumbi – Machakos',
        lat: Number(import.meta.env.VITE_BRANCH_KYUMBI_LAT ?? -1.4833),
        lng: Number(import.meta.env.VITE_BRANCH_KYUMBI_LNG ?? 37.2833),
        primary: false,
    },
];

// ─── Haversine distance ──────────────────────────────────────────────────────
/**
 * Calculates straight-line distance between two GPS coordinates (in km).
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
    const R = 6371; // Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ─── Fee calculation ─────────────────────────────────────────────────────────
/**
 * Calculates the delivery fee for a given distance.
 *
 * Rules:
 *  - Round distance UP to nearest whole km first
 *  - Free within freeRadiusKm (default 10 km)
 *  - Beyond that: charge ratePerKm (default 100 KES) for every km OVER the free radius
 *  - Round final fee to nearest 10 KES
 *
 * @param {number} distanceKm  Raw haversine distance (float)
 * @param {number} freeRadiusKm  Default: 10
 * @param {number} ratePerKm     Default: 100
 * @returns {{ distanceKm: number, fee: number, isFree: boolean }}
 *
 * Test cases:
 *   calculateDeliveryFee(5)    → { distanceKm: 5,  fee: 0,   isFree: true  }
 *   calculateDeliveryFee(10)   → { distanceKm: 10, fee: 0,   isFree: true  }
 *   calculateDeliveryFee(10.2) → { distanceKm: 11, fee: 100, isFree: false }  // rounds up first
 *   calculateDeliveryFee(12)   → { distanceKm: 12, fee: 200, isFree: false }  // 2km billable
 *   calculateDeliveryFee(15)   → { distanceKm: 15, fee: 500, isFree: false }  // 5km billable
 *   calculateDeliveryFee(10.5) → { distanceKm: 11, fee: 100, isFree: false }
 */
export function calculateDeliveryFee(distanceKm, freeRadiusKm = 10, ratePerKm = 100) {
    const roundedDistance = Math.ceil(distanceKm);

    if (roundedDistance <= freeRadiusKm) {
        return { distanceKm: roundedDistance, fee: 0, isFree: true };
    }

    const billableKm = roundedDistance - freeRadiusKm;
    const rawFee = billableKm * ratePerKm;
    const fee = Math.round(rawFee / 10) * 10; // round to nearest 10 KES

    return { distanceKm: roundedDistance, fee, isFree: false };
}

// ─── Full delivery quote ─────────────────────────────────────────────────────
/**
 * Finds the nearest branch to the customer and returns a complete delivery quote.
 *
 * @param {number} customerLat
 * @param {number} customerLng
 * @param {Array<{ name: string, lat: number, lng: number }>} branches   Defaults to BRANCHES
 * @param {number} freeRadiusKm  Default: 10
 * @param {number} ratePerKm     Default: 100
 * @returns {{
 *   nearestBranch: { name, shortName, lat, lng },
 *   rawDistanceKm: number,
 *   distanceKm: number,
 *   fee: number,
 *   isFree: boolean
 * }}
 */
export function getDeliveryQuote(
    customerLat,
    customerLng,
    branches = BRANCHES,
    freeRadiusKm = 10,
    ratePerKm = 100,
) {
    if (!branches || branches.length === 0) {
        throw new Error('No branches configured.');
    }

    let nearest = null;

    for (const branch of branches) {
        const distance = getDistanceKm(customerLat, customerLng, branch.lat, branch.lng);
        if (!nearest || distance < nearest.distance) {
            nearest = { branch, distance };
        }
    }

    const { distanceKm, fee, isFree } = calculateDeliveryFee(
        nearest.distance,
        freeRadiusKm,
        ratePerKm,
    );

    return {
        nearestBranch: nearest.branch,
        rawDistanceKm: nearest.distance,
        distanceKm,
        fee,
        isFree,
        // Customer GPS — used to build a Google Maps pin link in the WhatsApp message
        customerLat,
        customerLng,
    };
}
