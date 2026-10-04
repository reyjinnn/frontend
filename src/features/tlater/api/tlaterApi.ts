export interface TlaterAccount { id: number; userId: number; creditLimit: number; availableLimit: number; usedLimit: number; interestRateMonthly: number; lateFeeDaily: number; status: string }
export interface TlaterLoan { id: number; loanCode: string; orderId: number; principalAmount: number; adminFee: number; interestRate: number; totalInterest: number; totalLoanAmount: number; tenorMonths: number; status: string; disbursedAt: string }
export interface TlaterInstallment { id: number; installmentNumber: number; principalDue: number; interestDue: number; adminFeeDue?: number; lateFee: number; totalDue: number; totalPaid: number; dueDate: string; status: 'unpaid' | 'paid' | 'overdue'; isAdjusted?: boolean }
export interface RepaymentRequest { installmentId: number; amount: number; paymentMethod: string }
import { readDemoDB, requireDemoUser, demoRepository } from '../../../lib/demoRepository';

export const TlaterApi = {
  async getAccount(): Promise<TlaterAccount> {
    const user = requireDemoUser('customer');
    const db = readDemoDB();
    const used = db.loans.filter(l => l.userId === user.id).reduce((sum, l) => sum + l.installments.reduce((s, i) => s + (i.status === 'paid' ? 0 : i.principalDue), 0), 0);
    return { id: 301, userId: Number(user.id), creditLimit: db.settings.creditLimit, availableLimit: Math.max(0, db.settings.creditLimit - used), usedLimit: used, interestRateMonthly: 2.5, lateFeeDaily: 0.1, status: db.customers.find(c => c.id === user.id)?.kycStatus === 'verified' ? 'active' : 'inactive' };
  },
  async getLoans(): Promise<{ items: TlaterLoan[], total: number }> {
    const user = requireDemoUser('customer');
    const items = readDemoDB().loans.filter(l => l.userId === user.id).map(l => l.loan);
    return { items, total: items.length };
  },
  async getLoanDetails(loanCode: string): Promise<{ loan: TlaterLoan, installments: TlaterInstallment[] }> {
    const user = requireDemoUser('customer');
    const record = readDemoDB().loans.find(l => l.userId === user.id && l.loan.loanCode === loanCode);
    if (!record) throw new Error('Loan not found');
    return record;
  },
  async repayInstallment(req: RepaymentRequest, idempotencyKey: string): Promise<any> {
    return demoRepository.repay(req.installmentId, req.amount, idempotencyKey);
  }
};


