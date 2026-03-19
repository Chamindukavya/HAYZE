/**
 * Telegram Bot notification utility.
 * Sends order notifications to the configured Telegram chat
 * using the Bot API.
 */

interface OrderItem {
    name: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
}

interface OrderDetails {
    orderNumber: string;
    receiverName: string;
    receiverEmail: string;
    address: string;
    phone1: string;
    phone2: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: string;
}

/**
 * Send a Telegram message via the Bot API.
 */
async function sendTelegramMessage(text: string): Promise<boolean> {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('Telegram credentials not configured. Skipping notification.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API error:', errorData);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return false;
    }
}

/**
 * Send a new order notification to Telegram.
 */
export async function notifyNewOrder(order: OrderDetails): Promise<boolean> {
    const itemLines = order.items
        .map(
            (item, i) =>
                `  ${i + 1}. <b>${item.name}</b>${item.size ? ` | Size: ${item.size}` : ''}${item.color ? ` | Color: ${item.color}` : ''}\n     Qty: ${item.quantity} × Rs.${item.price.toFixed(2)}`
        )
        .join('\n');

    const message = `
🛒 <b>NEW ORDER RECEIVED!</b>

📦 <b>Order #:</b> ${order.orderNumber}
💳 <b>Payment:</b> ${order.paymentMethod}

👤 <b>Customer Details</b>
━━━━━━━━━━━━━━━
Name: ${order.receiverName}
Email: ${order.receiverEmail}
Phone 1: ${order.phone1}
Phone 2: ${order.phone2}
Address: ${order.address}

🛍️ <b>Items</b>
━━━━━━━━━━━━━━━
${itemLines}

💰 <b>Order Summary</b>
━━━━━━━━━━━━━━━
Subtotal: Rs.${order.subtotal.toFixed(2)}
Shipping: Rs.${order.shipping.toFixed(2)}
<b>Total: Rs.${order.total.toFixed(2)}</b>

⏰ ${new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}
`.trim();

    return sendTelegramMessage(message);
}
