import type { ExpenseCategory } from "@shared/schema";

interface ExpensesByCategoryProps {
  categories: ExpenseCategory[];
}

export default function ExpensesByCategory({ categories }: ExpensesByCategoryProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const essential = categories.find(c => c.categoryType === 'essential');
  const nonEssential = categories.find(c => c.categoryType === 'non_essential');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under':
        return <span className="status-badge status-under">Abaixo do Orçamento</span>;
      case 'over':
        return <span className="status-badge status-over">Acima do Orçamento</span>;
      case 'exact':
        return <span className="status-badge status-exact">No Orçamento</span>;
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

  if (!essential || !nonEssential) {
    return <div>Dados de categorias não encontrados</div>;
  }

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
        <h2 className="section-title">Gastos por Categoria</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Essential Expenses */}
        <div className="financial-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-white font-semibold">Gastos Essenciais</h3>
            </div>
            {getStatusBadge(essential.budgetStatus)}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Porcentagem</span>
              <span className="text-white font-medium">{essential.percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              <span className="text-white font-medium">{formatCurrency(essential.plannedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              <span className="text-white font-medium">{formatCurrency(essential.actualAmount)}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(essential.budgetStatus)}`}
                style={{ width: `${essential.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-400">
              {calculateVariance(essential.plannedAmount, essential.actualAmount)}
            </p>
          </div>
        </div>

        {/* Non-Essential Expenses */}
        <div className="financial-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-white font-semibold">Gastos Não Essenciais</h3>
            </div>
            {getStatusBadge(nonEssential.budgetStatus)}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Porcentagem</span>
              <span className="text-white font-medium">{nonEssential.percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              <span className="text-white font-medium">{formatCurrency(nonEssential.plannedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              <span className="text-white font-medium">{formatCurrency(nonEssential.actualAmount)}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(nonEssential.budgetStatus)}`}
                style={{ width: `${nonEssential.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-slate-400">
              {calculateVariance(nonEssential.plannedAmount, nonEssential.actualAmount)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
