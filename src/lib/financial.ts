export interface AmortizationSchedule {
  installmentNumber: number;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  isAdjusted: boolean;
}

export function calculateAmortization(
  principalAmount: number,
  tenorMonths: number,
  monthlyInterestRatePercent: number,
  adminFee: number = 0
): { installments: AmortizationSchedule[], totalInterest: number, totalLoanAmount: number } {
  
  const monthlyInterestRate = monthlyInterestRatePercent / 100;
  
  // Straight flat interest calculation based on original principal
  const monthlyInterest = Math.floor(principalAmount * monthlyInterestRate);
  const totalInterest = monthlyInterest * tenorMonths;
  const totalLoanAmount = principalAmount + totalInterest + adminFee;

  // Penny-balancing algorithm for Principal
  const baseMonthlyPrincipal = Math.floor(principalAmount / tenorMonths);
  const sumBasePrincipal = baseMonthlyPrincipal * (tenorMonths - 1);
  const finalMonthPrincipal = principalAmount - sumBasePrincipal; // Penny-balanced remainder

  const installments: AmortizationSchedule[] = [];

  for (let i = 1; i <= tenorMonths; i++) {
    const isLast = i === tenorMonths;
    const principalDue = isLast ? finalMonthPrincipal : baseMonthlyPrincipal;
    // In flat interest, usually admin fee is either paid upfront or spread. 
    // In our api mock from Sprint 3, admin fee was added to the first month or upfront.
    // Wait, simulation API says: `adminFee: 15000` but `totalLoanAmount` includes it. 
    // For simplicity, let's just add adminFee to the first month's totalDue if any, or ignore spreading it.
    // The API doc (endpoint 30) says: monthlyInstallment = 1254166.67 (which is (3500000/3) + 87500).
    // Admin fee isn't in the monthly installment in the api mock, it is a separate fee upfront or added to total.
    // Let's just output principalDue + interestDue for totalDue.
    const totalDue = principalDue + monthlyInterest;

    installments.push({
      installmentNumber: i,
      principalDue,
      interestDue: monthlyInterest,
      totalDue,
      isAdjusted: isLast && principalDue !== baseMonthlyPrincipal,
    });
  }

  return {
    installments,
    totalInterest,
    totalLoanAmount
  };
}
