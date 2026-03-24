import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import {tShirtTypes} from '@/utils/catogories';
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const category = req.nextUrl.searchParams.get('category');
    const gender = req.nextUrl.searchParams.get('gender');
    const sort = req.nextUrl.searchParams.get('sort');
    const featured = req.nextUrl.searchParams.get('featured');

    let query: any = {};
    if (category && category.toLowerCase() !== 'all') {
      if (['t-shirts'].includes(category.toLowerCase())) {
        query.category = { $in: tShirtTypes };
      }else {
        query.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
      }
    }
    if (gender === 'men') query.gender = { $in: ['men', 'unisex'] };
    if (gender === 'women') query.gender = { $in: ['women', 'unisex'] };
    if (gender === 'unisex') query.gender = 'unisex';
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
