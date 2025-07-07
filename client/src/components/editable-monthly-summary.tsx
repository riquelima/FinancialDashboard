import { useState } from "react";
import { FileText, CreditCard, TrendingUp, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MonthlySummary } from "@shared/schema";

interface EditableMonthlySummaryProps {
  summary: MonthlySummary;
  onSave: (summary: Partial<MonthlySummary>) => void;
}

export default function EditableMonthlySummary({ summary, onSave }: EditableMonthlySummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState({
    totalPlanned: summary.totalPlanned,
    totalSpent: summary.totalSpent,
    variance: summary.variance,
    variancePercentage: summary.variancePercentage,
  });

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const handleSave = () => {
    onSave(editSummary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSummary({
      totalPlanned: summary.totalPlanned,
      totalSpent: summary.totalSpent,
      variance: summary.variance,
      variancePercentage: summary.variancePercentage,
    });
    setIsEditing(false);
  };

  const varianceNum = parseFloat(editSummary.variance);
  const variancePercentageNum = parseFloat(editSummary.variancePercentage);

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
        <h2 className="section-title">Resumo do Mês</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Planned */}
        <div className="financial-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Planejado</h3>
          </div>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editSummary.totalPlanned}
              onChange={(e) => setEditSummary({ ...editSummary, totalPlanned: e.target.value })}
              className="text-2xl font-bold text-white mb-1 bg-slate-700 border-slate-600"
            />
          ) : (
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(editSummary.totalPlanned)}
            </div>
          )}
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
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editSummary.totalSpent}
              onChange={(e) => setEditSummary({ ...editSummary, totalSpent: e.target.value })}
              className="text-2xl font-bold text-white mb-1 bg-slate-700 border-slate-600"
            />
          ) : (
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(editSummary.totalSpent)}
            </div>
          )}
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
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                step="0.01"
                value={editSummary.variance}
                onChange={(e) => setEditSummary({ ...editSummary, variance: e.target.value })}
                className="text-2xl font-bold mb-1 bg-slate-700 border-slate-600 text-white"
              />
              <Input
                type="number"
                step="0.01"
                value={editSummary.variancePercentage}
                onChange={(e) => setEditSummary({ ...editSummary, variancePercentage: e.target.value })}
                className="text-sm bg-slate-700 border-slate-600 text-white"
                placeholder="% variação"
              />
            </div>
          ) : (
            <>
              <div className={`text-2xl font-bold mb-1 ${
                varianceNum < 0 ? 'text-green-400' : varianceNum > 0 ? 'text-red-400' : 'text-amber-400'
              }`}>
                {varianceNum < 0 ? '' : '+'}{formatCurrency(editSummary.variance)}
              </div>
              <p className="text-slate-400 text-sm">
                {Math.abs(variancePercentageNum).toFixed(2)}% {varianceNum < 0 ? 'abaixo' : varianceNum > 0 ? 'acima' : 'igual ao'} do orçamento
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}