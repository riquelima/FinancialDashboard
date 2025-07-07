import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExpenseCategory } from "@shared/schema";

interface EditableInvestmentsAndSpendingProps {
  categories: ExpenseCategory[];
  onSave: (categories: ExpenseCategory[]) => void;
}

export default function EditableInvestmentsAndSpending({ categories, onSave }: EditableInvestmentsAndSpendingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCategories, setEditCategories] = useState(categories);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const handleSave = () => {
    onSave(editCategories);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCategories(categories);
    setIsEditing(false);
  };

  const updateCategory = (index: number, field: keyof ExpenseCategory, value: string) => {
    const updated = [...editCategories];
    updated[index] = { ...updated[index], [field]: value };
    setEditCategories(updated);
  };

  const investments = editCategories.find(c => c.categoryType === 'investments');
  const leisure = editCategories.find(c => c.categoryType === 'leisure');
  const investmentsIndex = editCategories.findIndex(c => c.categoryType === 'investments');
  const leisureIndex = editCategories.findIndex(c => c.categoryType === 'leisure');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under':
        return <span className="status-badge status-under">Abaixo do Orçamento</span>;
      case 'over':
        return <span className="status-badge status-over">Acima do Orçamento</span>;
      case 'exact':
        return <span className="status-badge status-exact">Exatamente no Orçamento</span>;
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
      <div className="section-header">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        <h2 className="section-title">Investimentos e Gastos</h2>
        <div className="ml-auto flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button onClick={handleCancel} size="sm" variant="ghost">
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost">
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>

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
              {isEditing ? (
                <Input
                  type="number"
                  value={investments.percentage}
                  onChange={(e) => updateCategory(investmentsIndex, 'percentage', e.target.value)}
                  className="w-16 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{investments.percentage}%</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={investments.plannedAmount}
                  onChange={(e) => updateCategory(investmentsIndex, 'plannedAmount', e.target.value)}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(investments.plannedAmount)}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={investments.actualAmount}
                  onChange={(e) => updateCategory(investmentsIndex, 'actualAmount', e.target.value)}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(investments.actualAmount)}</span>
              )}
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
              {isEditing ? (
                <Input
                  type="number"
                  value={leisure.percentage}
                  onChange={(e) => updateCategory(leisureIndex, 'percentage', e.target.value)}
                  className="w-16 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{leisure.percentage}%</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Planejado</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={leisure.plannedAmount}
                  onChange={(e) => updateCategory(leisureIndex, 'plannedAmount', e.target.value)}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(leisure.plannedAmount)}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto Real</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={leisure.actualAmount}
                  onChange={(e) => updateCategory(leisureIndex, 'actualAmount', e.target.value)}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(leisure.actualAmount)}</span>
              )}
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