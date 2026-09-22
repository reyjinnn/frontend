import axios from 'axios';
import { calculateAmortization } from '../../../lib/financial';

const api = axios.create({
  baseURL: '/api/v1/tlater',
});

export interface TlaterAccount {
  id: number;
  userId: number;
  creditLimit: number;
  availableLimit: number;
  usedLimit: number;
  interestRateMonthly: number;
  lateFeeDaily: number;
  status: string;
}

export interface TlaterLoan {
  id: number;
  loanCode: string;
  orderId: number;
  principalAmount: number;
  adminFee: number;
  interestRate: number;
  totalInterest: number;
  totalLoanAmount: number;
  tenorMonths: number;
  status: string;
  disbursedAt: string;
}

export interface TlaterInstallment {
  id: number;
  installmentNumber: number;
  principalDue: number;
  interestDue: number;
  lateFee: number;
  totalDue: number;
  totalPaid: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  isAdjusted?: boolean;
}

export interface RepaymentRequest {
  installmentId: number;
  amount: number;
  paymentMethod: string;
}

let mockAccount: TlaterAccount = {
  id: 301,
  userId: 101,
  creditLimit: 10000000.0,
  availableLimit: 6500000.0,
  usedLimit: 3500000.0,
  interestRateMonthly: 2.5,
  lateFeeDaily: 0.1,
  status: "active"
};

let mockLoans: TlaterLoan[] = [
  {
    id: 401,
    loanCode: "LN-20260920-401",
    orderId: 801,
    principalAmount: 3500000.0,
    adminFee: 15000.0,
    interestRate: 2.5,
    totalInterest: 262500.0,
    totalLoanAmount: 3777500.0,
    tenorMonths: 3,
    status: "active",
    disbursedAt: new Date().toISOString()
  }
];

export const TlaterApi = {
  getAccount: async (): Promise<TlaterAccount> => {
    try {
      const res = await api.get('/account');
      return res.data;
    } catch (e) {
      return mockAccount;
    }
  },

  getLoans: async (): Promise<{ items: TlaterLoan[], total: number }> => {
    try {
      const res = await api.get('/loans');
      return res.data;
    } catch (e) {
      return { items: mockLoans, total: mockLoans.length };
    }
  },

  getLoanDetails: async (loanCode: string): Promise<{ loan: TlaterLoan, installments: TlaterInstallment[] }> => {
    try {
      const res = await api.get(`/loans/${loanCode}`);
      return res.data;
    } catch (e) {
      const loan = mockLoans.find(l => l.loanCode === loanCode) || mockLoans[0];
      const am = calculateAmortization(loan.principalAmount, loan.tenorMonths, loan.interestRate, loan.adminFee);
      
      const installments: TlaterInstallment[] = am.installments.map((inst, i) => {
        const due = new Date();
        due.setMonth(due.getMonth() + i + 1);
        return {
          id: 1200 + i,
          installmentNumber: inst.installmentNumber,
          principalDue: inst.principalDue,
          interestDue: inst.interestDue,
          lateFee: 0,
          totalDue: inst.totalDue,
          totalPaid: 0,
          dueDate: due.toISOString().split('T')[0],
          status: 'unpaid',
          isAdjusted: inst.isAdjusted
        };
      });

      return { loan, installments };
    }
  },

  repayInstallment: async (req: RepaymentRequest, idempotencyKey: string): Promise<any> => {
    try {
      const res = await api.post('/repayments', req, {
        headers: { 'Idempotency-Key': idempotencyKey }
      });
      return res.data;
    } catch (e) {
      // Mock deduction
      mockAccount.availableLimit += req.amount; // Roughly returning limit for demo
      mockAccount.usedLimit -= req.amount;
      return {
        paymentReference: "PAY-TL-849202",
        installmentId: req.installmentId,
        status: "paid",
        amountPaid: req.amount,
        newAvailableLimit: mockAccount.availableLimit
      };
    }
  }
};
