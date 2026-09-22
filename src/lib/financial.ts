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

  const monthlyInterest = Math.floor(principalAmount * monthlyInterestRate);
  const totalInterest = monthlyInterest * tenorMonths;
  const totalLoanAmount = principalAmount + totalInterest + adminFee;

  const baseMonthlyPrincipal = Math.floor(principalAmount / tenorMonths);
  const sumBasePrincipal = baseMonthlyPrincipal * (tenorMonths - 1);
  const finalMonthPrincipal = principalAmount - sumBasePrincipal; 

  const installments: AmortizationSchedule[] = [];

  for (let i = 1; i <= tenorMonths; i++) {
    const isLast = i === tenorMonths;
    const principalDue = isLast ? finalMonthPrincipal : baseMonthlyPrincipal;

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
