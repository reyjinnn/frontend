export type OrderStatus = 'unpaid' | 'shipping' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  protectionFee: number;
  promoDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  courier: string;
  estimatedArrival: string;
  shippingAddress: string;
  hasTlater: boolean;
  payment?: {
    status: 'pending' | 'paid' | 'failed' | 'expired';
    expiresAt: string;
    virtualAccountNumber: string;
    cashAmount: number;
  };
}

export interface TrackingPoint {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

export interface TrackingInfo {
  orderId: string;
  courierName: string;
  service: string;
  receiptNumber: string;
  currentStatus: string;
  timeline: TrackingPoint[];
}
