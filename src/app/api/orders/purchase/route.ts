import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth';
import { Wallet, TransactionType } from '@/models/Wallet';
import { Order, OrderType, OrderStatus, FulfillmentMethod } from '@/models/Order';
import { distributeCommission } from '@/lib/commission';

// POST /api/orders/purchase
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyTitle, price, location } = body;

    if (!propertyTitle || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check Customer Wallet Balance
    const customerWallet = await Wallet.findOne({ user: user.userId });
    if (!customerWallet || customerWallet.balance < price) {
      return NextResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    // 2. Create Order (Record the purchase)
    const order = new Order({
      user: user.userId,
      type: OrderType.PROCUREMENT, // Using Procurement for "Buying Property" for now
      status: OrderStatus.COMPLETED, // Instant completion for digital simulation
      itemDescription: `Property Purchase: ${propertyTitle}`,
      fulfillmentMethod: FulfillmentMethod.DELIVERY, // Placeholder
      deliveryAddress: {
        street: location || 'Digital Delivery',
        city: 'N/A',
        state: 'N/A',
        country: 'N/A',
        zipCode: '00000',
      },
      totalAmount: price,
      paidAt: new Date(),
      completedAt: new Date(),
    });
    await order.save();

    // 3. Deduct Funds from Customer
    // We use the method we defined, but we need to handle the promise
    await customerWallet.debit(price, TransactionType.PAYMENT, order._id);

    // 4. Distribute Commission
    const commissionResult = await distributeCommission(
      user.userId,
      price,
      order._id.toString()
    );

    return NextResponse.json({
      message: 'Purchase successful',
      order,
      commission: commissionResult,
    });

  } catch (error: any) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
