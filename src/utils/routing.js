/**
 * routing.js
 * Driving-distance lookup for delivery quotes.
 *
 * Uses the public OSRM demo server (OpenStreetMap road network, no API key).
 * One `table` request returns the road distance from every branch to the
 * customer in a single round trip. Any failure (offline, timeout, server
 * error, point not routable) resolves to null for that branch so the caller
 * can fall back to a straight-line estimate instead of blocking checkout.
 *
 * To self-host or switch providers later, change OSRM_BASE_URL (or set
 * VITE_OSRM_BASE_URL) — the response shape is the standard OSRM table API.
 */

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const OSRM_BASE_URL = (env.VITE_OSRM_BASE_URL || 'https://router.project-osrm.org').replace(/\/$/, '');

/**
 * Road distance (km) from each branch to the customer.
 *
 * @param {number} customerLat
 * @param {number} customerLng
 * @param {Array<{ lat: number, lng: number }>} branches
 * @param {{ signal?: AbortSignal, timeoutMs?: number }} [options]
 * @returns {Promise<Array<number|null>>} km per branch, same order as `branches`; null = unavailable
 */
export async function getRoadDistancesKm(customerLat, customerLng, branches, { signal, timeoutMs = 7000 } = {}) {
    const empty = (branches || []).map(() => null);
    if (!branches?.length || typeof fetch !== 'function' || signal?.aborted) return empty;

    // OSRM wants lng,lat pairs. Sources = branches, destination = customer (last).
    const coords = [
        ...branches.map((b) => `${Number(b.lng)},${Number(b.lat)}`),
        `${Number(customerLng)},${Number(customerLat)}`,
    ].join(';');
    const sources = branches.map((_, i) => i).join(';');
    const destination = branches.length;

    const url =
        `${OSRM_BASE_URL}/table/v1/driving/${coords}` +
        `?sources=${sources}&destinations=${destination}&annotations=distance`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const onOuterAbort = () => controller.abort();
    signal?.addEventListener('abort', onOuterAbort, { once: true });

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return empty;
        const data = await res.json();
        if (data?.code !== 'Ok' || !Array.isArray(data.distances)) return empty;

        return branches.map((_, i) => {
            const metres = data.distances[i]?.[0];
            return typeof metres === 'number' && Number.isFinite(metres) && metres >= 0
                ? metres / 1000
                : null;
        });
    } catch {
        return empty;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onOuterAbort);
    }
}
