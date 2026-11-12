-- Supabase Migration: delivery rate 200 KES/km + corrected branch coordinates
--
-- The original seed had both branches in the wrong place (Whitehouse ~2 km off,
-- Kyumvi ~18 km off). These coordinates match the branch pins linked from the
-- Contact page. The per-km rate beyond the free radius moves from 100 to 200.

UPDATE delivery_settings
SET rate_per_km      = 200,
    branch_locations = '[
        {
            "name":      "Whitehouse Footbridge, Tena Estate",
            "shortName": "Whitehouse – Tena",
            "lat":       -1.2922833,
            "lng":       36.8859225,
            "primary":   true
        },
        {
            "name":      "Kyumvi, Mombasa Road (Machakos Junction)",
            "shortName": "Kyumvi – Machakos",
            "lat":       -1.5303409,
            "lng":       37.1288169,
            "primary":   false
        }
    ]'::jsonb;

-- New installs: make the column default match the live rate.
ALTER TABLE delivery_settings ALTER COLUMN rate_per_km SET DEFAULT 200;
