export interface AmortizationSchedule {
  installmentNumber: number;
  principalDue: number;
  interestDue: number;
  adminFeeDue: number;
  totalDue: number;
  isAdjusted: boolean;
}

export function calculateAmortization(principalAmount: number, tenorMonths: number, monthlyInterestRatePercent: number, adminFee = 0) {
  if (![principalAmount, adminFee].every(v => Number.isSafeInteger(v) && v >= 0) || !Number.isInteger(tenorMonths) || tenorMonths < 1 || tenorMonths > 60 || !Number.isFinite(monthlyInterestRatePercent) || monthlyInterestRatePercent < 0) throw new Error('Invalid loan terms');
  const totalInterest = Math.round(principalAmount * monthlyInterestRatePercent / 100 * tenorMonths);
  const part = (amount: number, i: number) => Math.floor(amount / tenorMonths) + (i === tenorMonths ? amount % tenorMonths : 0);
  const installments = Array.from({ length: tenorMonths }, (_, index) => {
    const i = index + 1;
    const principalDue = part(principalAmount, i);
    const interestDue = part(totalInterest, i);
    const adminFeeDue = part(adminFee, i);
    return { installmentNumber: i, principalDue, interestDue, adminFeeDue, totalDue: principalDue + interestDue + adminFeeDue, isAdjusted: i === tenorMonths && [principalAmount, totalInterest, adminFee].some(v => v % tenorMonths !== 0) };
  });
  return { installments, totalInterest, totalLoanAmount: principalAmount + totalInterest + adminFee };
}
