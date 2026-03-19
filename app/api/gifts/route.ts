import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gift from '@/models/Gift';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { senderName, recipientName, message } = body;

    if (!senderName || !recipientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gift = await Gift.create({
      senderName,
      recipientName,
      message,
    });

    return NextResponse.json(gift, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const gifts = await Gift.find({}).sort({ createdAt: -1 });
    return NextResponse.json(gifts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
