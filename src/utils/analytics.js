/**
 * analytics.js — thin wrapper around GA4 (gtag) and Meta Pixel (fbq).
 *
 * All functions are safe to call unconditionally — they check whether
 * the global functions exist before calling them, so nothing breaks if
 * the user hasn't consented or the scripts haven't loaded yet.
 */

/* ─── Helpers ──────────────────────────────────────────────────── */
function gtag(...args) {
    if (typeof window.gtag === 'function') window.gtag(...args);
}

function fbq(...args) {
    if (typeof window.fbq === 'function') window.fbq(...args);
}

const KES = (n) => Number(n || 0);

/* ─── Page views ───────────────────────────────────────────────── */
/**
 * Call on every route change (see usePageTracking hook).
 * @param {string} path  e.g. '/shop'
 */
export function trackPageView(path) {
    gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
    });
    fbq('track', 'PageView');
}

/* ─── Product events ───────────────────────────────────────────── */
/**
 * Visitor viewed a product detail page or product modal.
 * @param {{ id: string|number, name: string, category: string, price: number }} product
 */
export function trackProductView(product) {
    gtag('event', 'view_item', {
        currency: 'KES',
        value: KES(product.price),
        items: [{
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category,
            price: KES(product.price),
        }],
    });
    fbq('track', 'ViewContent', {
        content_ids: [String(product.id)],
        content_name: product.name,
        content_type: 'product',
        value: KES(product.price),
        currency: 'KES',
    });
}

/**
 * Item added to cart.
 * @param {{ id: string|number, name: string, category: string, price: number, quantity?: number }} product
 */
export function trackAddToCart(product) {
    const qty = product.quantity || 1;
    gtag('event', 'add_to_cart', {
        currency: 'KES',
        value: KES(product.price) * qty,
        items: [{
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category,
            price: KES(product.price),
            quantity: qty,
        }],
    });
    fbq('track', 'AddToCart', {
        content_ids: [String(product.id)],
        content_name: product.name,
        content_type: 'product',
        value: KES(product.price) * qty,
        currency: 'KES',
    });
}

/* ─── Checkout events ──────────────────────────────────────────── */
/**
 * Visitor started the checkout flow.
 * @param {Array<{ id, name, category, price, quantity }>} cartItems
 * @param {number} total
 */
export function trackBeginCheckout(cartItems = [], total = 0) {
    gtag('event', 'begin_checkout', {
        currency: 'KES',
        value: KES(total),
        items: cartItems.map(item => ({
            item_id: String(item.id),
            item_name: item.name,
            item_category: item.category,
            price: KES(item.price),
            quantity: item.quantity || 1,
        })),
    });
    fbq('track', 'InitiateCheckout', {
        value: KES(total),
        currency: 'KES',
        num_items: cartItems.length,
    });
}

/**
 * Visitor completed their order (WhatsApp link opened = purchase intent confirmed).
 * @param {Array} cartItems
 * @param {number} total
 */
export function trackPurchase(cartItems = [], total = 0) {
    const orderId = `BA-${Date.now()}`;
    gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'KES',
        value: KES(total),
        items: cartItems.map(item => ({
            item_id: String(item.id),
            item_name: item.name,
            item_category: item.category,
            price: KES(item.price),
            quantity: item.quantity || 1,
        })),
    });
    fbq('track', 'Purchase', {
        value: KES(total),
        currency: 'KES',
    });
}

/* ─── Engagement events ────────────────────────────────────────── */
/**
 * WhatsApp CTA clicked.
 * @param {'float' | 'product' | 'cart' | 'checkout' | 'header'} context
 */
export function trackWhatsAppClick(context = 'unknown') {
    gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: context,
    });
    fbq('trackCustom', 'WhatsAppClick', { context });
}

/**
 * A form was successfully submitted.
 * @param {'contact' | 'newsletter' | 'signup_banner'} formName
 */
export function trackFormSubmit(formName) {
    gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: formName,
    });
    fbq('track', 'Lead', { form_name: formName });
}

/**
 * Generic search event (for future search functionality).
 * @param {string} searchTerm
 */
export function trackSearch(searchTerm) {
    gtag('event', 'search', { search_term: searchTerm });
    fbq('track', 'Search', { search_string: searchTerm });
}
