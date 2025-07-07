import { FileText, CreditCard, TrendingUp } from "lucide-react";
import type { MonthlySummary } from "@shared/schema";

interface MonthlySummaryProps {
  summary: MonthlySummary;
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const varianceNum = parseFloat(summary.variance);
  const variancePercentageNum = parseFloat(summary.variancePercentage);

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
        <h2 className="section-title">Resumo do Mês</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Planned */}
        <div className="financial-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Planejado</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(summary.totalPlanned)}
          </div>
          <p className="text-slate-400 text-sm">Orçamento definido</p>
        </div>

        {/* Total Spent */}
        <div className="financial-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Gasto</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(summary.totalSpent)}
          </div>
          <p className="text-slate-400 text-sm">Valor efetivamente gasto</p>
        </div>

        {/* Variance */}
        <div className="financial-card">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              varianceNum < 0 ? 'bg-green-600' : varianceNum > 0 ? 'bg-red-600' : 'bg-amber-600'
            }`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Variação</h3>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            varianceNum < 0 ? 'text-green-400' : varianceNum > 0 ? 'text-red-400' : 'text-amber-400'
          }`}>
            {varianceNum < 0 ? '' : '+'}{formatCurrency(summary.variance)}
          </div>
          <p className="text-slate-400 text-sm">
            {Math.abs(variancePercentageNum).toFixed(2)}% {varianceNum < 0 ? 'abaixo' : varianceNum > 0 ? 'acima' : 'igual ao'} do orçamento
          </p>
        </div>
      </div>
    </section>
  );
}
