import { Card, CardContent } from "@/components/ui/card";
import { ExpenseCategory } from "@shared/schema";
import { formatCurrency, calculateTotals } from "@/lib/financial-data";
import { FileText, CreditCard, TrendingUp } from "lucide-react";

interface SummaryStatsProps {
  expenses: ExpenseCategory[];
}

export function SummaryStats({ expenses }: SummaryStatsProps) {
  const totals = calculateTotals(expenses);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">📋 Resumo do Mês</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Total Planejado</h3>
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">{formatCurrency(totals.totalPlanned)}</div>
            <p className="text-gray-400 text-sm">Orçamento definido</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Total Gasto</h3>
              <CreditCard className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">{formatCurrency(totals.totalReal)}</div>
            <p className="text-gray-400 text-sm">Valor efetivamente gasto</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Variação</h3>
              <TrendingUp className={`w-6 h-6 ${totals.variation <= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div className={`text-2xl font-bold mb-2 ${totals.variation <= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totals.variation <= 0 ? '-' : '+'}{formatCurrency(Math.abs(totals.variation))}
            </div>
            <p className="text-gray-400 text-sm">
              {Math.abs(totals.variationPercentage).toFixed(2)}% {totals.variation <= 0 ? 'abaixo' : 'acima'} do orçamento
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
