import api from '../../../lib/axios';
import type { Product } from '../../../services/catalog.service';

let mockCart: CartItem[] = [];

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface SplitCheckoutRequest {
  items: { productId: number; quantity: number }[];
  shippingCity: string;
  usePoints?: number;
  useTlater?: boolean;
  tlaterTenor?: number;
}

export const CheckoutApi = {
  async getCart() {
    try {
      const res = await api.get('localhost:3000/api/v1/cart');
      return res.data;
    } catch (e) {
      console.warn("API /cart offline, using mock.");
      const totalItemAmount = mockCart.reduce((sum, item) => sum + item.subtotal, 0);
      return { items: mockCart, totalItemAmount };
    }
  },

  async addToCart(product: Product, quantity: number = 1) {
    try {
      const res = await api.post('localhost:3000/api/v1/cart/items', { productId: product.id, quantity });
      return res.data;
    } catch (e) {
      const existing = mockCart.find(i => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
        existing.subtotal = existing.quantity * existing.price;
      } else {
        const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl || "";
        mockCart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity,
          imageUrl: primaryImage
        });
      }
      return this.getCart();
    }
  },

  async updateCartItem(productId: number, quantity: number) {
    try {
      const res = await api.patch(`localhost:3000/api/v1/cart/items/${productId}`, { quantity });
      return res.data;
    } catch (e) {
      const existing = mockCart.find(i => i.productId === productId);
      if (existing) {
        if (quantity <= 0) {
          mockCart = mockCart.filter(i => i.productId !== productId);
        } else {
          existing.quantity = quantity;
          existing.subtotal = existing.quantity * existing.price;
        }
      }
      return this.getCart();
    }
  },

  async removeCartItem(productId: number) {
    try {
      const res = await api.delete(`localhost:3000/api/v1/cart/items/${productId}`);
      return res.data;
    } catch (e) {
      mockCart = mockCart.filter(i => i.productId !== productId);
      return this.getCart();
    }
  },

  async getPointsWallet() {
    try {
      const res = await api.get('localhost:3000/api/v1/points/wallet');
      return res.data;
    } catch (e) {
      return { userId: 101, balance: 150000, lockedBalance: 0, availableBalance: 150000, updatedAt: new Date().toISOString() };
    }
  },

  async getTlaterAccount() {
    try {
      const res = await api.get('localhost:3000/api/v1/tlater/account');
      return res.data;
    } catch (e) {
      return { id: 301, userId: 101, creditLimit: 10000000.0, availableLimit: 6500000.0, usedLimit: 3500000.0, interestRateMonthly: 2.5, lateFeeDaily: 0.1, status: "active" };
    }
  },

  async simulateCheckout(req: SplitCheckoutRequest) {
    try {
      const res = await api.post('localhost:3000/api/v1/checkout/simulate', req);
      return res.data;
    } catch (e) {
      
      const itemsSubtotal = mockCart.reduce((sum, item) => sum + item.subtotal, 0);
      const shippingFee = 25000.0;
      let grandTotal = itemsSubtotal + shippingFee;
      
      let pointsDeduction = 0;
      if (req.usePoints && req.usePoints > 0) {
        pointsDeduction = Math.min(req.usePoints, grandTotal);
      }
      
      let remainingAfterPoints = grandTotal - pointsDeduction;
      
      let tlaterPrincipal = 0;
      let tlaterInterest = 0;
      let tlaterAdminFee = 0;
      let tlaterMonthlyInstallment = 0;
      let gatewayCashRequired = remainingAfterPoints;

      if (req.useTlater) {
        const availableLimit = 6500000.0; 
        tlaterPrincipal = Math.min(remainingAfterPoints, availableLimit);

        const tenor = req.tlaterTenor || 1;
        if (tenor === 1) {
          
          tlaterAdminFee = tlaterPrincipal * 0.01;
          tlaterMonthlyInstallment = tlaterPrincipal + tlaterAdminFee;
        } else if (tenor === 3 || tenor === 6) {
          
          tlaterInterest = tlaterPrincipal * 0.025 * tenor;
          tlaterMonthlyInstallment = (tlaterPrincipal + tlaterInterest) / tenor;
        }

        gatewayCashRequired = remainingAfterPoints - tlaterPrincipal;
      }

      return {
        totalItemAmount: itemsSubtotal,
        shippingFee,
        grandTotal,
        pointsUsed: pointsDeduction, 
        pointsDeduction,
        tlaterPrincipal,
        tlaterInterest,
        tlaterAdminFee,
        tlaterMonthlyInstallment,
        gatewayCashRequired
      };
    }
  },

  async checkout(req: any, idempotencyKey: string) {
    try {
      const res = await api.post('localhost:3000/api/v1/checkout', req, {
        headers: { 'Idempotency-Key': idempotencyKey }
      });
      return res.data;
    } catch (e) {
      const sim = await this.simulateCheckout(req as SplitCheckoutRequest);
      mockCart = []; 
      return {
        order: {
          id: 802,
          orderNumber: `TV-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random()*1000)}`,
          userId: 101,
          totalItemAmount: sim.totalItemAmount,
          shippingFee: sim.shippingFee,
          discountAmount: 0,
          grandTotal: sim.grandTotal,
          status: "pending"
        },
        splitBreakdown: {
          pointsDeduction: sim.pointsDeduction,
          tlaterLoanPrincipal: sim.tlaterPrincipal,
          gatewayCashAmount: sim.gatewayCashRequired
        },
        paymentInstructions: {
          virtualAccountNumber: "8808" + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
          paymentGatewayUrl: "https://simulator.techvibe.id/pay/mock",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      };
    }
  }
};
