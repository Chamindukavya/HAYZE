import { NextRequest, NextResponse } from 'next/server';
import { notifyContactMessage } from '@/lib/telegram-contact';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { firstName, lastName, email, subject, message } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send the telegram message
        const success = await notifyContactMessage({
            firstName,
            lastName,
            email,
            subject,
            message
        });

        if (!success) {
            // Still return 200, but maybe we can log or handle this differently if needed
            console.error("Failed to send contact message to Telegram");
        }

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
