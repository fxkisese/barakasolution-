-- Supabase Migration: delivery_settings table
-- Run this in the Supabase SQL Editor (or save as a migration file)
-- Dashboard → SQL Editor → New Query → paste and run

CREATE TABLE IF NOT EXISTS delivery_settings (
    id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    free_radius_km   numeric     NOT NULL DEFAULT 10,
    rate_per_km      numeric     NOT NULL DEFAULT 100,
    branch_locations jsonb       NOT NULL DEFAULT '[]',
    updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Seed with default settings (Whitehouse is primary branch)
INSERT INTO delivery_settings (free_radius_km, rate_per_km, branch_locations)
VALUES (
    10,
    100,
    '[
        {
            "name":      "Whitehouse Footbridge, Tena Estate",
            "shortName": "Whitehouse \u2013 Tena",
            "lat":       -1.3040,
            "lng":       36.8695,
            "primary":   true
        },
        {
            "name":      "Kyumbi / Machakos Junction",
            "shortName": "Kyumbi \u2013 Machakos",
            "lat":       -1.4833,
            "lng":       37.2833,
            "primary":   false
        }
    ]'::jsonb
)
-- Skip if a row already exists
ON CONFLICT DO NOTHING;

-- Update trigger: keeps updated_at current whenever the row changes
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS delivery_settings_updated_at ON delivery_settings;
CREATE TRIGGER delivery_settings_updated_at
    BEFORE UPDATE ON delivery_settings
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Enable Row Level Security (read-only for anonymous users)
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read delivery settings"
    ON delivery_settings FOR SELECT
    USING (true);

-- Only service role / authenticated admins can update
CREATE POLICY "Admins can update delivery settings"
    ON delivery_settings FOR UPDATE
    USING (auth.role() = 'authenticated');
