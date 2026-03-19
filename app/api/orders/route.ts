import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Order from '@/models/Order';
import Product from '@/models/Product';
import connectDB from '@/lib/db';
import { notifyNewOrder } from '@/lib/telegram';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
}

// POST: Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      items,
      subtotal,
      shipping,
      total,
      receiverName,
      receiverEmail,
      address,
      phone1,
      phone2,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!receiverName || !receiverEmail || !address || !phone1 || !phone2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify stock availability
    const productsToUpdate = [];
    for (const item of items) {
      if (!item.productId && !item._id) continue;
      const lookupId = item.productId || item._id;

      const product = await Product.findById(lookupId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found in our system.` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}. Only ${product.stock} left.` },
          { status: 400 }
        );
      }

      productsToUpdate.push({
        product,
        quantity: item.quantity
      });
    }

    // Decrement stock for all items
    for (const { product, quantity } of productsToUpdate) {
      product.stock -= quantity;
      await product.save();
    }

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      userId: (session?.user as any)?.id || null,
      items,
      subtotal,
      shipping,
      total,
      receiverName,
      receiverEmail,
      address,
      phone1,
      phone2,
      status: 'ORDERED',
      paymentMethod: 'COD',
    });

    await order.save();

    // Send Telegram notification (non-blocking — don't let it fail the order)
    notifyNewOrder({
      orderNumber,
      receiverName,
      receiverEmail,
      address,
      phone1,
      phone2,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: 'COD',
    }).catch((err) => console.error('Telegram notification error:', err));

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        orderId: order._id,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET: Fetch orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // If searching by order number (public endpoint)
    if (orderNumber) {
      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ order }, { status: 200 });
    }

    // If admin is fetching all orders
    if ((session?.user as any)?.role === 'admin') {
      const query: {
        status?: string;
        createdAt?: { $gte?: Date; $lte?: Date };
      } = {};

      if (status && ['ORDERED', 'PACKING', 'HAND_OVER_TO_COURIER', 'DELIVERED'].includes(status)) {
        query.status = status;
      }

      if (dateFrom || dateTo) {
        query.createdAt = {};

        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          if (!Number.isNaN(fromDate.getTime())) {
            query.createdAt.$gte = fromDate;
          }
        }

        if (dateTo) {
          const toDate = new Date(dateTo);
          if (!Number.isNaN(toDate.getTime())) {
            toDate.setHours(23, 59, 59, 999);
            query.createdAt.$lte = toDate;
          }
        }

        if (Object.keys(query.createdAt).length === 0) {
          delete query.createdAt;
        }
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ orders }, { status: 200 });
    }

    // If user is fetching their own orders
    if ((session?.user as any)?.id) {
      const userOrders = await Order.find({ userId: (session?.user as any)?.id }).sort({
        createdAt: -1,
      });
      return NextResponse.json({ orders: userOrders }, { status: 200 });
    }

    // If no session and no search params
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
