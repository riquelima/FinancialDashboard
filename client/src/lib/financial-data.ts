import { ExpenseCategory, IncomeData } from "@shared/schema";

export interface FinancialDashboardData {
  income: IncomeData;
  expenses: ExpenseCategory[];
}

export const getStatusColor = (status: ExpenseCategory['status']) => {
  switch (status) {
    case 'below':
      return 'text-green-400';
    case 'above':
      return 'text-red-400';
    case 'onTarget':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
};

export const getStatusLabel = (status: ExpenseCategory['status']) => {
  switch (status) {
    case 'below':
      return 'Abaixo do Orçamento';
    case 'above':
      return 'Acima do Orçamento';
    case 'onTarget':
      return 'No Limite';
    default:
      return 'Indefinido';
  }
};

export const getStatusBadgeClass = (status: ExpenseCategory['status']) => {
  switch (status) {
    case 'below':
      return 'status-below';
    case 'above':
      return 'status-above';
    case 'onTarget':
      return 'status-onTarget';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getProgressPercentage = (planned: number, real: number) => {
  if (planned === 0) return 0;
  return Math.min((real / planned) * 100, 100);
};

export const getVariationText = (planned: number, real: number) => {
  const difference = real - planned;
  const percentage = planned > 0 ? Math.abs(difference / planned) * 100 : 0;
  
  if (difference > 0) {
    return `Gastou R$ ${difference.toFixed(2)} a mais (${percentage.toFixed(0)}% acima do planejado)`;
  } else if (difference < 0) {
    return `Economizou R$ ${Math.abs(difference).toFixed(2)} (${percentage.toFixed(0)}% abaixo do planejado)`;
  } else {
    return 'Exatamente no planejado (0% de variação)';
  }
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateTotals = (expenses: any[]) => {
  const totalPlanned = expenses.reduce((sum, exp) => sum + exp.planned, 0);
  const totalReal = expenses.reduce((sum, exp) => sum + exp.real, 0);
  const variation = totalReal - totalPlanned;

  return {
    totalPlanned,
    totalReal,
    variation,
    variationPercentage: totalPlanned > 0 ? (variation / totalPlanned) * 100 : 0
  };
};