import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gift from '@/models/Gift';
import Product from '@/models/Product';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const gift = await Gift.findById(id).populate('claimedItem');
    
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json(gift);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { productId, status } = body;

    const updateData: any = {};
    if (productId) {
      updateData.claimedItem = productId;
      updateData.status = 'claimed';
      updateData.claimedAt = new Date();
    }
    if (status) {
      updateData.status = status;
    }

    const gift = await Gift.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json(gift);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
