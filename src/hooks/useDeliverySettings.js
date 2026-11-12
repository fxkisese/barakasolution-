import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { BRANCHES, DEFAULT_FREE_RADIUS_KM, DEFAULT_RATE_PER_KM } from '@/utils/deliveryUtils';

const DEFAULTS = {
    freeRadiusKm: DEFAULT_FREE_RADIUS_KM,
    ratePerKm: DEFAULT_RATE_PER_KM,
    branches: BRANCHES,
    loading: false,
};

/**
 * useDeliverySettings
 * Fetches delivery pricing rules from the `delivery_settings` Supabase table.
 * Falls back to hardcoded defaults if the fetch fails, so checkout never breaks.
 *
 * Returns: { freeRadiusKm, ratePerKm, branches, loading }
 */
export function useDeliverySettings() {
    const [settings, setSettings] = useState({ ...DEFAULTS, loading: true });

    useEffect(() => {
        let cancelled = false;

        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from('delivery_settings')
                    .select('*')
                    .limit(1)
                    .single();

                if (cancelled) return;

                if (error || !data) {
                    // Table may not exist yet — silently use defaults
                    setSettings({ ...DEFAULTS, loading: false });
                    return;
                }

                setSettings({
                    freeRadiusKm: Number(data.free_radius_km ?? DEFAULTS.freeRadiusKm),
                    ratePerKm: Number(data.rate_per_km ?? DEFAULTS.ratePerKm),
                    branches: Array.isArray(data.branch_locations) && data.branch_locations.length > 0
                        ? data.branch_locations
                        : DEFAULTS.branches,
                    loading: false,
                });
            } catch {
                if (!cancelled) setSettings({ ...DEFAULTS, loading: false });
            }
        }

        fetchSettings();
        return () => { cancelled = true; };
    }, []);

    return settings;
}
