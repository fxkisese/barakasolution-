/**
 * WhatsApp utility helpers — open wa.me links with pre-filled messages.
 * All functions are fire-and-forget (open a new tab); nothing is saved.
 */

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_WHATSAPP || '254700000000';

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
        `*Price:* ${fmt(product.price || 0)}\n\n` +
        `Please let me know the next steps.`;
    openWA(ADMIN_PHONE, msg);
}

export function sendProductInquiryWhatsApp(product) {
    const msg =
        `❓ *Product Inquiry — Luxe Craft Furniture*\n\n` +
        `Hello! I have a question about this product:\n\n` +
        `*Item:* ${product.name}\n` +
        `*Category:* ${product.category || 'N/A'}\n` +
        `*Price:* ${fmt(product.price || 0)}\n\n` +
        `Could you provide more details?`;
    openWA(ADMIN_PHONE, msg);
}

export function sendGeneralInquiryWhatsApp() {
    const msg = `Hello Luxe Craft Furniture! I have a general inquiry...`;
    openWA(ADMIN_PHONE, msg);
}

export function sendCartCheckoutWhatsApp(cartItems, total, details) {
    let msg = `🛍️ *New Store Order — Luxe Craft Furniture*\n\n`;
    msg += `*Customer:* ${details.name}\n`;
    msg += `*Phone:* ${details.phone}\n`;
    msg += `*Address:* ${details.address}\n\n`;
    msg += `*Items:*\n`;
    
    cartItems.forEach(item => {
        msg += `- ${item.quantity}x ${item.name} (${fmt(item.price || 0)})\n`;
    });
    
    msg += `\n*Total Amount:* ${fmt(total)}\n\n`;
    msg += `I would like to complete my payment for this order.`;
    
    openWA(ADMIN_PHONE, msg);
}
