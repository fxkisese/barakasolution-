import { describe, it, expect } from 'vitest';
import {
    calculateDeliveryFee,
    getDeliveryQuote,
    getDistanceKm,
    BRANCHES,
    FALLBACK_ROAD_FACTOR,
} from './deliveryUtils';

describe('calculateDeliveryFee (free radius 10 km, KES 200/km)', () => {
    it('is free inside the radius', () => {
        expect(calculateDeliveryFee(5)).toEqual({ distanceKm: 5, billableKm: 0, fee: 0, isFree: true });
        expect(calculateDeliveryFee(10)).toEqual({ distanceKm: 10, billableKm: 0, fee: 0, isFree: true });
    });

    it('bills fractions of a km beyond the radius, rounded to KES 10', () => {
        expect(calculateDeliveryFee(10.2)).toEqual({ distanceKm: 10.2, billableKm: 0.2, fee: 40, isFree: false });
        expect(calculateDeliveryFee(12)).toEqual({ distanceKm: 12, billableKm: 2, fee: 400, isFree: false });
        expect(calculateDeliveryFee(15.37)).toEqual({ distanceKm: 15.4, billableKm: 5.4, fee: 1080, isFree: false });
        expect(calculateDeliveryFee(25)).toEqual({ distanceKm: 25, billableKm: 15, fee: 3000, isFree: false });
    });

    it('honours settings overrides', () => {
        expect(calculateDeliveryFee(12, 5, 150)).toEqual({ distanceKm: 12, billableKm: 7, fee: 1050, isFree: false });
        expect(calculateDeliveryFee(12, 0, 200).fee).toBe(2400);
    });

    it('treats bad input as zero distance', () => {
        expect(calculateDeliveryFee(NaN)).toEqual({ distanceKm: 0, billableKm: 0, fee: 0, isFree: true });
        expect(calculateDeliveryFee(-4)).toEqual({ distanceKm: 0, billableKm: 0, fee: 0, isFree: true });
    });
});

describe('getDistanceKm', () => {
    it('returns zero for identical points', () => {
        expect(getDistanceKm(-1.29, 36.82, -1.29, 36.82)).toBe(0);
    });

    it('measures the two branches roughly 38 km apart', () => {
        const [a, b] = BRANCHES;
        expect(getDistanceKm(a.lat, a.lng, b.lat, b.lng)).toBeCloseTo(37.8, 0);
    });
});

describe('getDeliveryQuote', () => {
    const cbd = { lat: -1.2921, lng: 36.8219 }; // Nairobi CBD

    it('uses road distance when provided and picks the nearest branch by road', () => {
        const q = getDeliveryQuote(cbd.lat, cbd.lng, BRANCHES, 10, 200, [8.9386, 47.08]);
        expect(q.nearestBranch.shortName).toBe('Whitehouse – Tena');
        expect(q.distanceSource).toBe('road');
        expect(q.distanceKm).toBe(8.9);
        expect(q.fee).toBe(0);
        expect(q.isFree).toBe(true);
    });

    it('falls back to straight-line x road factor and flags it as an estimate', () => {
        const q = getDeliveryQuote(cbd.lat, cbd.lng, BRANCHES, 10, 200, [null, null]);
        expect(q.distanceSource).toBe('estimate');
        expect(q.distanceKm).toBeCloseTo(q.straightLineKm * FALLBACK_ROAD_FACTOR, 0);
    });

    it('routes a customer near Kyumvi to the Kyumvi branch', () => {
        const q = getDeliveryQuote(-1.52, 37.1, BRANCHES, 10, 200);
        expect(q.nearestBranch.shortName).toBe('Kyumvi – Machakos');
    });

    it('carries the pricing inputs and customer pin through to the quote', () => {
        const q = getDeliveryQuote(cbd.lat, cbd.lng, BRANCHES, 8, 250, [20, 60]);
        expect(q).toMatchObject({ freeRadiusKm: 8, ratePerKm: 250, billableKm: 12, fee: 3000, customerLat: cbd.lat, customerLng: cbd.lng });
    });

    it('throws without branches', () => {
        expect(() => getDeliveryQuote(0, 0, [])).toThrow();
    });
});
