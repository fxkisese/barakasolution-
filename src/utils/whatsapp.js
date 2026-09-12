/**
 * WhatsApp utility helpers — open wa.me links with pre-filled messages.
 * All functions are fire-and-forget (open a new tab); nothing is saved.
 */

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_WHATSAPP || '254797624196';

function openWA(phone, message) {
    const cleaned = String(phone || '').replace(/\D/g, '');
    const number = cleaned.startsWith('0') ? '254' + cleaned.slice(1) : cleaned || ADMIN_PHONE;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

const fmt = (n) => `KSh ${Number(n || 0).toLocaleString()}`;

export function sendOrderToAdminWhatsApp(order) {
    const msg =
        `🛋️ *New Order — Luxe Craft Furniture*\n` +
        `Customer: ${order.customer}\n` +
        `Phone: ${order.phone || 'N/A'}\n` +
        `Item: ${order.item}\n` +
        `Amount: ${fmt(order.amount)}\n` +
        `Payment: ${order.payment} via ${order.method}\n` +
        `Branch: ${order.branch}\n` +
        `Date: ${order.date}`;
    openWA(ADMIN_PHONE, msg);
}

export function sendSaleReceiptWhatsApp(sale) {
    const msg =
        `✅ *Payment Receipt — Luxe Craft Furniture*\n\n` +
        `Dear ${sale.customer},\n\n` +
        `Thank you for your purchase!\n\n` +
        `*Item:* ${sale.item}\n` +
        `*Amount Paid:* ${fmt(sale.amount)}\n` +
        `*Method:* ${sale.method}\n` +
        `*Date:* ${sale.date}\n` +
        `*Branch:* ${sale.branch}\n\n` +
        `We appreciate your business. 🙏\n` +
        `— Luxe Craft Furniture, Nairobi`;
    openWA(sale.phone, msg);
}

export function sendNewCreditReceiptWhatsApp(credit) {
    const balance = credit.total - credit.paid;
    const msg =
        `🪑 *Credit Sale Receipt — Luxe Craft Furniture*\n\n` +
        `Dear ${credit.customer},\n\n` +
        `*Item:* ${credit.item}\n` +
        `*Total Price:* ${fmt(credit.total)}\n` +
        `*Deposit Paid:* ${fmt(credit.paid)}\n` +
        `*Balance Remaining:* ${fmt(balance)}\n` +
        `*Due Date:* ${credit.due_date}\n` +
        `*Branch:* ${credit.branch}\n\n` +
        `Please clear your balance by the due date. Thank you! 🙏\n` +
        `— Luxe Craft Furniture`;
    openWA(credit.phone, msg);
}

export function sendCreditReminderWhatsApp(credit) {
    const balance = credit.total - credit.paid;
    const msg =
        `🔔 *Balance Reminder — Luxe Craft Furniture*\n\n` +
        `Dear ${credit.customer},\n\n` +
        `This is a friendly reminder that you have an outstanding balance:\n\n` +
        `*Item:* ${credit.item}\n` +
        `*Balance Due:* ${fmt(balance)}\n` +
        `*Due Date:* ${credit.due_date}\n\n` +
        `Please contact us to arrange payment.\n` +
        `📞 Call/WhatsApp: ${ADMIN_PHONE}\n\n` +
        `— Luxe Craft Furniture, Nairobi`;
    openWA(credit.phone, msg);
}

export function sendAddToCartWhatsApp(product) {
    const msg =
        `🛒 *New Order Inquiry — Luxe Craft Furniture*\n\n` +
        `Hello! I would like to order:\n\n` +
        `*Item:* ${product.name}\n` +
        `*Category:* ${product.category || 'N/A'}\n` +
        `*Price:* ${fmt(product.price || 0)}\n` +
        (product.image ? `*Product Image:* ${product.image}\n` : '') +
        `\nPlease let me know the next steps.`;
    openWA(ADMIN_PHONE, msg);
}

export function sendProductInquiryWhatsApp(product, productUrl) {
    const formattedPrice = `KSh ${Number(product.price || 0).toLocaleString('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
    const url = productUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const msg =
        `Hello, I want to purchase:\n\n` +
        `*${product.name}*\n` +
        `*Price:* ${formattedPrice}\n` +
        `*URL:* ${url}\n\n` +
        `Thank you!`;
    openWA(ADMIN_PHONE, msg);
}

export function sendGeneralInquiryWhatsApp() {
    const msg = `Hello Luxe Craft Furniture! I have a general inquiry...`;
    openWA(ADMIN_PHONE, msg);
}

export function sendCartCheckoutWhatsApp(cartItems, total, details, deliveryQuote = null) {
    let msg = `🛍️ *New Store Order — Luxe Craft Furniture*\n\n`;
    msg += `*Customer:* ${details.name}\n`;
    msg += `*Phone:* ${details.phone}\n`;
    if (details.address) msg += `*Address Notes:* ${details.address}\n`;

    // ── Delivery location + directions from shop ────────────────────────────
    if (deliveryQuote?.customerLat != null && deliveryQuote?.customerLng != null) {
        const { customerLat, customerLng, nearestBranch } = deliveryQuote;
        const branchLat = nearestBranch?.lat ?? -1.3040;
        const branchLng = nearestBranch?.lng ?? 36.8695;
        const branchName = nearestBranch?.shortName || nearestBranch?.name || 'Shop';

        // Pin drop location
        msg += `*📍 Customer Pin:* https://www.google.com/maps?q=${customerLat},${customerLng}\n`;

        // Directions URL: branch → customer (opens Google Maps turn-by-turn)
        const directionsUrl = `https://www.google.com/maps/dir/${branchLat},${branchLng}/${customerLat},${customerLng}`;
        msg += `*🗺️ Directions from ${branchName}:* ${directionsUrl}\n`;

        // Static map image (requires VITE_GOOGLE_MAPS_KEY in .env.local)
        const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
        if (mapsKey) {
            const centerLat = (((Number(branchLat) + Number(customerLat)) / 2)).toFixed(5);
            const centerLng = (((Number(branchLng) + Number(customerLng)) / 2)).toFixed(5);
            const staticMapUrl =
                `https://maps.googleapis.com/maps/api/staticmap` +
                `?size=600x400` +
                `&center=${centerLat},${centerLng}` +
                `&markers=color:green%7Clabel:S%7C${branchLat},${branchLng}` +
                `&markers=color:red%7Clabel:D%7C${customerLat},${customerLng}` +
                `&path=color:0x1a73e8CC%7Cweight:4%7C${branchLat},${branchLng}%7C${customerLat},${customerLng}` +
                `&key=${mapsKey}`;
            msg += `*🗺️ Map Image:* ${staticMapUrl}\n`;
        }
    }

    // ── Items list ──────────────────────────────────────────────────────────
    msg += `\n*Items:*\n`;
    cartItems.forEach((item, i) => {
        msg += `${i + 1}. ${item.quantity}x *${item.name}* — ${fmt(item.price || 0)}\n`;
    });

    // ── Totals ──────────────────────────────────────────────────────────────
    msg += `\n*Subtotal:* ${fmt(total)}`;

    if (deliveryQuote) {
        if (deliveryQuote.isFree) {
            msg += `\n*Delivery:* FREE (within ${deliveryQuote.distanceKm}km of ${deliveryQuote.nearestBranch?.shortName || deliveryQuote.nearestBranch?.name || 'nearest branch'})`;
        } else {
            msg += `\n*Delivery:* ${fmt(deliveryQuote.fee)} (${deliveryQuote.distanceKm}km from ${deliveryQuote.nearestBranch?.shortName || deliveryQuote.nearestBranch?.name || 'nearest branch'})`;
        }
        const grandTotal = total + (deliveryQuote.fee || 0);
        msg += `\n*Grand Total:* ${fmt(grandTotal)}`;
    } else {
        msg += `\n*Total Amount:* ${fmt(total)}`;
    }

    msg += `\n\nI would like to complete my payment for this order.`;

    // ── Product photos — bare URLs at the end trigger WhatsApp image previews
    // WhatsApp renders a rich preview card for the last URL it finds in a message.
    // Placing each image URL on its own line after all text maximises preview chances.
    const itemsWithImages = cartItems.filter(item => item.image && String(item.image).startsWith('http'));
    if (itemsWithImages.length > 0) {
        msg += `\n\n📸 *Item Photos:*`;
        itemsWithImages.forEach(item => {
            // Each image URL on its own line — WhatsApp generates a preview card per URL
            msg += `\n${item.name}:\n${item.image}`;
        });
    }

    openWA(ADMIN_PHONE, msg);
}

