import { User, UserRole } from '@/models/User';
import { Wallet, TransactionType } from '@/models/Wallet';
import mongoose from 'mongoose';

/**
 * Distributes commission for a completed order/purchase.
 * 
 * Flow:
 * 1. Identify the Agent who referred the Customer.
 * 2. Calculate Commission Amount based on Agent's rate.
 * 3. Credit Agent's Wallet.
 * 4. Log the transaction.
 * 
 * @param customerId - ID of the customer making the purchase
 * @param purchaseAmount - Total amount of the purchase
 * @param orderId - ID of the order/property being purchased
 */
export async function distributeCommission(
  customerId: string,
  purchaseAmount: number,
  orderId: string
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch Customer to find Referrer
    const customer = await User.findById(customerId).session(session);
    if (!customer) throw new Error('Customer not found');

    // If no referrer, no commission to pay (Platform keeps 100% of fee/margin)
    if (!customer.referredBy) {
      await session.commitTransaction();
      return { commissionPaid: 0, agentId: null };
    }

    // 2. Fetch Agent
    const agent = await User.findById(customer.referredBy).session(session);
    if (!agent || agent.role !== UserRole.AGENT) {
      // Referrer might not be an active agent anymore
      await session.commitTransaction();
      return { commissionPaid: 0, agentId: null };
    }

    // 3. Calculate Commission
    // Default to 0 if not set. Rate is a percentage (e.g., 5 for 5%)
    const rate = agent.commissionRate || 0;
    if (rate <= 0) {
      await session.commitTransaction();
      return { commissionPaid: 0, agentId: agent._id };
    }

    const commissionAmount = (purchaseAmount * rate) / 100;

    // 4. Credit Agent Wallet
    let agentWallet = await Wallet.findOne({ user: agent._id }).session(session);
    
    // Create wallet if it doesn't exist (auto-provisioning)
    if (!agentWallet) {
      agentWallet = new Wallet({
        user: agent._id,
        balance: 0,
        lockedBalance: 0,
        transactions: [],
      });
    }

    // Use the schema method if possible, but we need to pass the session
    // Since methods on instances might not support session passing easily without modification,
    // we'll do the update manually here to ensure atomicity with the session.
    
    agentWallet.balance += commissionAmount;
    agentWallet.transactions.push({
      type: TransactionType.COMMISSION,
      amount: commissionAmount,
      status: 'completed',
      referenceId: orderId,
      description: `Commission for purchase by ${customer.firstName} ${customer.lastName}`,
      createdAt: new Date(),
    });

    await agentWallet.save({ session });

    // Update Agent's total earnings (optional, if we track it on User model too, but Wallet is source of truth)
    // For the dashboard stats, we might want to aggregate transactions, but let's stick to Wallet.

    await session.commitTransaction();
    
    console.log(`Commission distributed: $${commissionAmount} to Agent ${agent.email}`);
    return { commissionPaid: commissionAmount, agentId: agent._id };

  } catch (error) {
    await session.abortTransaction();
    console.error('Commission distribution failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}
