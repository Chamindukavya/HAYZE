import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');

    let query: any = {};
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.isFeatured = true;

    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price-low') sortQuery = { price: 1 };
    if (sort === 'price-high') sortQuery = { price: -1 };
    if (sort === 'popular') sortQuery = { clicks: -1 };

    const products = await Product.find(query).sort(sortQuery);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
