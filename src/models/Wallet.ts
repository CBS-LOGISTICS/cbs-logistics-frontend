import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'deposit',           // Funding wallet
  WITHDRAWAL = 'withdrawal',     // Taking money out
  PAYMENT = 'payment',           // Paying for an order (locks funds)
  REFUND = 'refund',             // Money returned
  COMMISSION = 'commission',     // Platform fee deduction
  RELEASE = 'release',           // Funds released to supplier
  EARNING = 'earning',           // Supplier/Agent earning
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ITransaction {
  type: TransactionType;
  amount: number;
  fee?: number; // Platform fee if applicable
  status: TransactionStatus;
  referenceId?: string; // Order ID, External Payment ID, etc.
  referenceType?: 'Order' | 'PaymentGateway' | 'Admin';
  description?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;        // Available funds
  lockedBalance: number;  // Funds locked in active orders
  currency: string;
  transactions: ITransaction[];
  
  // Methods
  credit(amount: number, type: TransactionType, ref?: any): Promise<void>;
  debit(amount: number, type: TransactionType, ref?: any): Promise<void>;
  lockFunds(amount: number, ref?: any): Promise<void>;
  releaseFunds(amount: number, ref?: any): Promise<void>; // Move locked -> transferred (or burned if paying out)
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    referenceId: String,
    referenceType: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockedBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD', // Or local currency
    },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
  }
);

// Methods
walletSchema.methods.credit = async function (amount: number, type: TransactionType, ref?: any) {
  this.balance += amount;
  this.transactions.push({
    type,
    amount,
    status: TransactionStatus.COMPLETED,
    referenceId: ref?.id || ref,
    createdAt: new Date(),
  });
  await this.save();
};

walletSchema.methods.debit = async function (amount: number, type: TransactionType, ref?: any) {
  if (this.balance < amount) {
    throw new Error('Insufficient funds');
  }
  this.balance -= amount;
  this.transactions.push({
    type,
    amount: -amount, // Negative for debit
    status: TransactionStatus.COMPLETED,
    referenceId: ref?.id || ref,
    createdAt: new Date(),
  });
  await this.save();
};

walletSchema.methods.lockFunds = async function (amount: number, ref?: any) {
  if (this.balance < amount) {
    throw new Error('Insufficient funds to lock');
  }
  this.balance -= amount;
  this.lockedBalance += amount;
  this.transactions.push({
    type: TransactionType.PAYMENT, // Locking is usually for payment
    amount: -amount,
    status: TransactionStatus.PENDING, // Pending until released
    referenceId: ref?.id || ref,
    description: 'Funds locked for order',
    createdAt: new Date(),
  });
  await this.save();
};

walletSchema.methods.releaseFunds = async function (amount: number, ref?: any) {
  if (this.lockedBalance < amount) {
    throw new Error('Insufficient locked funds');
  }
  this.lockedBalance -= amount;
  // Note: We don't add to balance here, we assume it's being spent/transferred.
  // If we wanted to refund, we'd use a different method or handle it manually.
  this.transactions.push({
    type: TransactionType.RELEASE,
    amount: 0, // The amount was already deducted from balance when locked
    status: TransactionStatus.COMPLETED,
    referenceId: ref?.id || ref,
    description: 'Locked funds released/spent',
    createdAt: new Date(),
  });
  await this.save();
};

export const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema);
