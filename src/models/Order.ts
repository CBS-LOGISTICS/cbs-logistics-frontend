import mongoose, { Document, Schema } from 'mongoose';

export enum OrderType {
  PROCUREMENT = 'procurement',
  WAREHOUSING = 'warehousing',
  DISTRIBUTION = 'distribution',
}

export enum FulfillmentMethod {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  PENDING = 'pending',           // Created, waiting for quote/action
  QUOTED = 'quoted',             // Supplier sent quote
  PAID = 'paid',                 // Customer paid (funds locked)
  PROCESSING = 'processing',     // Supplier/Partner working
  FULFILLED = 'fulfilled',       // Delivered/Stored
  COMPLETED = 'completed',       // Customer confirmed (funds released)
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Customer
  type: OrderType;
  status: OrderStatus;
  
  // Common Details
  itemDescription: string;
  fulfillmentMethod: FulfillmentMethod;
  
  // Location Details
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  pickupPoint?: string; // For Pickup method or Warehousing
  
  // Assignment
  preferredSupplier?: mongoose.Types.ObjectId;
  preferredWarehouse?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId; // Actual supplier/partner handling it
  
  // Documents & Financials
  receiptUploadUrl?: string; // Initial request receipt if needed
  quoteUrl?: string;
  invoiceUrl?: string;
  requisitionUrl?: string;
  
  quoteAmount?: number;
  platformFee?: number;
  totalAmount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  quotedAt?: Date;
  paidAt?: Date;
  fulfilledAt?: Date;
  completedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    itemDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fulfillmentMethod: {
      type: String,
      enum: Object.values(FulfillmentMethod),
      required: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    pickupPoint: {
      type: String,
    },
    preferredSupplier: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming suppliers are Users
    },
    preferredWarehouse: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Or a separate Warehouse model if needed, sticking to User for now
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiptUploadUrl: String,
    quoteUrl: String,
    invoiceUrl: String,
    requisitionUrl: String,
    
    quoteAmount: Number,
    platformFee: Number,
    totalAmount: Number,
    
    quotedAt: Date,
    paidAt: Date,
    fulfilledAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
