export function calculateEmi(principal: number, annualRate: number, months: number) {
  if (months <= 0 || principal <= 0) return 0;
  if (annualRate === 0) return Math.round(principal / months);
  const r = annualRate / 12 / 100;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

export function totalPayable(monthlyPayment: number, months: number, processingFee = 0, cashback = 0) {
  return Math.max(0, monthlyPayment * months + processingFee - cashback);
}
