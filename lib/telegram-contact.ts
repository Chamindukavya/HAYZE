/**
 * Telegram notification utility for Contact Form messages.
 */

export interface ContactMessageDetails {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

/**
 * Send a contact form message to Telegram.
 */
export async function notifyContactMessage(details: ContactMessageDetails): Promise<boolean> {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('Telegram credentials not configured. Skipping notification.');
        return false;
    }

    const text = `
📩 <b>NEW CONTACT MESSAGE</b>

👤 <b>From:</b> ${details.firstName} ${details.lastName}
📧 <b>Email:</b> ${details.email}
📝 <b>Subject:</b> ${details.subject}

💬 <b>Message:</b>
${details.message}

⏰ ${new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}
`.trim();

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
        console.error('Failed to send Telegram contact notification:', error);
        return false;
    }
}
