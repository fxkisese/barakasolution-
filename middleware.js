/**
 * Vercel Edge Middleware — Dynamic OG meta tag injection for product pages.
 *
 * Runs on Vercel's Edge Runtime (Deno-compatible, zero cold starts).
 * Intercepts /product/:id requests and injects product-specific OG tags
 * into index.html so WhatsApp / Facebook crawlers see the correct preview.
 *
 * Required Vercel Environment Variables (server-side only — NOT VITE_ prefixed):
 *   SUPABASE_URL              — e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (never exposed to client)
 *   SITE_URL                  — canonical domain, e.g. https://luxecraft.ke
 */

export const config = {
    matcher: ['/product/:id'],
};

export default async function middleware(req) {
    const url = new URL(req.url);

    // Extract the product id from the path: /product/<uuid-or-id>
    const pathParts = url.pathname.split('/product/');
    const productId = pathParts[1]?.split('/')[0];

    if (!productId) {
        // No id found — let the normal SPA handle it
        return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const siteUrl     = process.env.SITE_URL || 'https://www.luxecraftsfurniture.com';

    // Fetch product details from Supabase REST API
    let product = null;
    try {
        const apiRes = await fetch(
            `${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=name,description,image&limit=1`,
            {
                headers: {
                    apikey: serviceKey,
                    Authorization: `Bearer ${serviceKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (apiRes.ok) {
            const rows = await apiRes.json();
            product = rows?.[0] ?? null;
        }
    } catch (_) {
        // On any fetch error, fall through to default index.html
    }

    if (!product) {
        // Product not found — let the SPA handle the 404 redirect
        return;
    }

    // Fetch the compiled index.html from Vercel's own static assets
    let html = '';
    try {
        const htmlRes = await fetch(`${url.origin}/index.html`);
        html = await htmlRes.text();
    } catch (_) {
        return;
    }

    const pageUrl   = `${siteUrl}/product/${productId}`;
    const title     = product.name        || 'Luxe Craft Furniture';
    const desc      = truncate(product.description || 'Curated furniture from Nairobi, Kenya. Durable. Stylish. Affordable.');
    const image     = product.image       || `${siteUrl}/logo.png`;

    // Replace existing generic OG tags
    let injected = html
        .replace(
            /<meta property="og:title"[^>]*>/,
            `<meta property="og:title" content="${esc(title)}" />`
        )
        .replace(
            /<meta property="og:description"[^>]*>/,
            `<meta property="og:description" content="${esc(desc)}" />`
        )
        .replace(
            /<meta name="description"[^>]*>/,
            `<meta name="description" content="${esc(desc)}" />`
        )
        .replace(
            /<title>[^<]*<\/title>/,
            `<title>${esc(title)} — Luxe Craft Furniture</title>`
        );

    // Inject image / url / type tags (not present in index.html by default)
    injected = injected.replace(
        '</head>',
        `  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${esc(pageUrl)}" />
  <meta property="og:site_name" content="Luxe Craft Furniture" />
  <meta property="og:type" content="product" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${esc(image)}" />
</head>`
    );

    return new Response(injected, {
        headers: {
            'content-type': 'text/html; charset=utf-8',
            // Allow CDN to cache for 5 min; revalidate in bg (stale-while-revalidate)
            'cache-control': 'public, max-age=300, stale-while-revalidate=3600',
        },
    });
}

/** HTML-escape double quotes in attribute values */
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Keep OG descriptions to ~155 chars */
function truncate(str, max = 155) {
    if (str.length <= max) return str;
    return str.slice(0, max - 1).trimEnd() + '…';
}
