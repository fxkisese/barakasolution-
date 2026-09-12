/**
 * DeliveryCalculator.jsx
 *
 * Lets the customer:
 *   1. Type their address (Nominatim geocoding — free, no API key)
 *   2. AND/OR drop a pin on an interactive Leaflet/OpenStreetMap map
 *
 * Once a location is selected, calculates delivery fee using haversine distance
 * from the nearest branch and calls onQuoteReady(quote) with the result.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Loader2, CheckCircle2, AlertTriangle, Navigation } from 'lucide-react';
import { getDeliveryQuote } from '@/utils/deliveryUtils';
import { useDeliverySettings } from '@/hooks/useDeliverySettings';

// ─── Fix Leaflet default marker icon (Vite/webpack asset issue) ──────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pin icon for the customer location
const customerIcon = new L.DivIcon({
    html: `<div style="
        width:28px;height:36px;
        background:#1A1A1A;
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
});

// Branch marker icon
const branchIcon = new L.DivIcon({
    html: `<div style="
        width:22px;height:22px;
        background:#D97706;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

// ─── Map click handler ───────────────────────────────────────────────────────
function MapClickHandler({ onLocationPick }) {
    useMapEvents({
        click(e) {
            onLocationPick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// ─── Nominatim geocoding ─────────────────────────────────────────────────────
async function geocodeAddress(query) {
    const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        countrycodes: 'ke', // bias to Kenya
        addressdetails: '1',
    });
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'BarakaSolutionsApp/1.0' } }
    );
    if (!res.ok) throw new Error('Geocoding request failed');
    return res.json(); // Array of { lat, lon, display_name, ... }
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DeliveryCalculator({ onQuoteReady }) {
    const { freeRadiusKm, ratePerKm, branches, loading: settingsLoading } = useDeliverySettings();

    // Map state
    const [customerPos, setCustomerPos]   = useState(null); // { lat, lng }
    const mapRef = useRef(null);

    // Address search state
    const [query, setQuery]               = useState('');
    const [suggestions, setSuggestions]   = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError]   = useState('');
    const debounceRef = useRef(null);

    // Quote state
    const [quote, setQuote]               = useState(null);
    const [quoteError, setQuoteError]     = useState('');

    // ── Compute quote whenever customerPos changes ────────────────────────────
    useEffect(() => {
        if (!customerPos || settingsLoading) return;
        try {
            const q = getDeliveryQuote(customerPos.lat, customerPos.lng, branches, freeRadiusKm, ratePerKm);
            setQuote(q);
            setQuoteError('');
            onQuoteReady?.(q);
        } catch (err) {
            setQuoteError('Could not calculate fee. Please try a different location.');
            setQuote(null);
            onQuoteReady?.(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerPos, branches, freeRadiusKm, ratePerKm, settingsLoading]);

    // ── Address search (debounced, 500ms) ─────────────────────────────────────
    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setSuggestions([]);
        setSearchError('');

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (val.trim().length < 3) return;

        debounceRef.current = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const results = await geocodeAddress(val.trim());
                setSuggestions(results.slice(0, 5));
                if (results.length === 0) setSearchError('No locations found. Try a different address or use the map.');
            } catch {
                setSearchError('Address search failed. Please drop a pin on the map instead.');
            } finally {
                setSearchLoading(false);
            }
        }, 500);
    };

    const selectSuggestion = useCallback((result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setCustomerPos({ lat, lng });
        setQuery(result.display_name);
        setSuggestions([]);
        // Pan the map to the selected location
        mapRef.current?.flyTo([lat, lng], 14, { duration: 1 });
    }, []);

    // ── Pin drop from map ─────────────────────────────────────────────────────
    const handleLocationPick = useCallback((lat, lng) => {
        setCustomerPos({ lat, lng });
        setQuery('');
        setSuggestions([]);
    }, []);

    // ── Use device location ───────────────────────────────────────────────────
    const handleGeolocate = () => {
        if (!navigator.geolocation) {
            setSearchError('Your browser does not support location access.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setCustomerPos({ lat, lng });
                mapRef.current?.flyTo([lat, lng], 14, { duration: 1 });
                setQuery('Current location');
            },
            () => {
                setSearchError('Could not access your location. Please drop a pin on the map.');
            }
        );
    };

    // ── Map centre: default to Nairobi CBD ───────────────────────────────────
    const mapCenter = customerPos
        ? [customerPos.lat, customerPos.lng]
        : [-1.2921, 36.8219]; // Nairobi

    return (
        <div className="space-y-3">
            {/* ── Address search bar ─────────────────────────────────────── */}
            <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Delivery Location
                </label>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                        id="delivery-address-search"
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Type your area or road name…"
                        autoComplete="off"
                        className="w-full h-11 pl-9 pr-10 bg-white border border-stone-200 focus:border-obsidian outline-none transition-colors text-sm text-obsidian placeholder:text-stone-400 rounded-sm"
                    />

                    {/* Use my location button */}
                    <button
                        type="button"
                        onClick={handleGeolocate}
                        title="Use my current location"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-stone-400 hover:text-obsidian transition-colors"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>

                    {/* Loading spinner */}
                    {searchLoading && (
                        <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 animate-spin" />
                    )}

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-white border border-stone-200 shadow-lg rounded-sm overflow-hidden max-h-56 overflow-y-auto">
                            {suggestions.map((s, i) => (
                                <li key={i}>
                                    <button
                                        type="button"
                                        onClick={() => selectSuggestion(s)}
                                        className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors flex items-start gap-2 border-b border-stone-100 last:border-0"
                                    >
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-stone-400" />
                                        <span className="line-clamp-2">{s.display_name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {searchError && (
                    <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {searchError}
                    </p>
                )}
            </div>

            {/* ── Map hint ──────────────────────────────────────────────── */}
            <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                Or tap anywhere on the map to drop your delivery pin
            </p>

            {/* ── Leaflet map ────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-sm border border-stone-200" style={{ height: 260 }}>
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Branch markers */}
                    {branches.map((b, i) => (
                        <Marker
                            key={i}
                            position={[b.lat, b.lng]}
                            icon={branchIcon}
                            title={b.name || b.shortName}
                        />
                    ))}

                    {/* Customer pin */}
                    {customerPos && (
                        <Marker
                            position={[customerPos.lat, customerPos.lng]}
                            icon={customerIcon}
                            title="Your delivery location"
                        />
                    )}

                    <MapClickHandler onLocationPick={handleLocationPick} />
                </MapContainer>

                {/* Map overlay legend */}
                <div className="absolute bottom-2 left-2 z-[500] bg-white/90 backdrop-blur-sm border border-stone-200 rounded-sm px-2 py-1.5 flex gap-3 text-[10px] text-stone-600 pointer-events-none">
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-amber-600 border border-white shrink-0" />
                        Our branch
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm bg-obsidian border border-white shrink-0" />
                        Your location
                    </span>
                </div>
            </div>

            {/* ── Delivery fee result card ───────────────────────────────── */}
            {quoteError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {quoteError}
                </div>
            )}

            {quote && !quoteError && (
                <div className={`p-4 rounded-sm border ${quote.isFree
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-stone-50 border-stone-200'
                }`}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-xs text-stone-500 mb-0.5">
                                {quote.distanceKm} km from {quote.nearestBranch.shortName || quote.nearestBranch.name}
                            </p>
                            <p className={`font-semibold text-base ${quote.isFree ? 'text-emerald-700' : 'text-obsidian'}`}>
                                {quote.isFree ? 'Free Delivery' : `KES ${quote.fee.toLocaleString()}`}
                            </p>
                            {!quote.isFree && (
                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {quote.distanceKm - 10} km beyond free radius × KES 100/km
                                </p>
                            )}
                        </div>
                        <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                            quote.isFree ? 'bg-emerald-100' : 'bg-stone-100'
                        }`}>
                            <CheckCircle2 className={`w-5 h-5 ${quote.isFree ? 'text-emerald-600' : 'text-stone-500'}`} strokeWidth={1.8} />
                        </div>
                    </div>
                </div>
            )}

            {!customerPos && !quoteError && (
                <p className="text-[11px] text-stone-400 text-center py-1">
                    Select your location above to see the delivery fee.
                </p>
            )}
        </div>
    );
}
