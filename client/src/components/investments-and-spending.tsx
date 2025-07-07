import type { ExpenseCategory } from "@shared/schema";

interface InvestmentsAndSpendingProps {
  categories: ExpenseCategory[];
}

export default function InvestmentsAndSpending({ categories }: InvestmentsAndSpendingProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const investments = categories.find(c => c.categoryType === 'investments');
  const leisure = categories.find(c => c.categoryType === 'leisure');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under':
        return <span className="status-badge status-under">Abaixo do Orçamento</span>;
      case 'over':
        return <span className="status-badge status-over">Acima do Orçamento</span>;
      case 'exact':
        return <span className="status-badge status-exact">{investments?.categoryType === 'investments' ? '17%' : ''}</span>;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'bg-green-500';
      case 'over':
        return 'bg-red-500';
      case 'exact':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculateVariance = (planned: string, actual: string) => {
    const plannedNum = parseFloat(planned);
    const actualNum = parseFloat(actual);
    const variance = actualNum - plannedNum;
    const percentage = Math.abs((variance / plannedNum) * 100);
    
    if (variance < 0) {
      return `Economizou ${formatCurrency(Math.abs(variance).toString())} (${percentage.toFixed(0)}% abaixo do planejado)`;
    } else if (variance > 0) {
      return `Gastou ${formatCurrency(variance.toString())} a mais (${percentage.toFixed(0)}% acima do planejado)`;
    } else {
      return 'Exatamente no planejado (0% de variação)';
    }
  };

  if (!investments || !leisure) {
    return <div>Dados de investimentos e gastos não encontrados</div>;
  }

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investments */}
        <div className="financial-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-white font-semibold">Investimentos</h3>
            </div>
            {getStatusBadge(investments.budgetStatus)}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Porcentagem</span>
              <span className="text-white font-medium">{investments.percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              <span className="text-white font-medium">{formatCurrency(investments.plannedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              <span className="text-white font-medium">{formatCurrency(investments.actualAmount)}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(investments.budgetStatus)}`}
                style={{ width: `${investments.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-400">
              {calculateVariance(investments.plannedAmount, investments.actualAmount)}
            </p>
          </div>
        </div>

        {/* Leisure/Entertainment */}
        <div className="financial-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-white font-semibold">Torrar</h3>
            </div>
            {getStatusBadge(leisure.budgetStatus)}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Porcentagem</span>
              <span className="text-white font-medium">{leisure.percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              <span className="text-white font-medium">{formatCurrency(leisure.plannedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              <span className="text-white font-medium">{formatCurrency(leisure.actualAmount)}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(leisure.budgetStatus)}`}
                style={{ width: `${leisure.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-400">
              {calculateVariance(leisure.plannedAmount, leisure.actualAmount)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
