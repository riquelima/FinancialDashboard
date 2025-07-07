import { useState } from "react";
import { TrendingUp, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FinancialData } from "@shared/schema";

interface EditableRevenueBalanceSectionProps {
  data: FinancialData;
  onSave: (data: Partial<FinancialData>) => void;
}

export default function EditableRevenueBalanceSection({ data, onSave }: EditableRevenueBalanceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    monthStartSalary: data.monthStartSalary,
    monthStartFgts: data.monthStartFgts,
    monthStartBonuses: data.monthStartBonuses,
    monthEndSalary: data.monthEndSalary,
    monthEndBenefits: data.monthEndBenefits,
    netTotal: data.netTotal,
    remainingBalance: data.remainingBalance,
  });

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      monthStartSalary: data.monthStartSalary,
      monthStartFgts: data.monthStartFgts,
      monthStartBonuses: data.monthStartBonuses,
      monthEndSalary: data.monthEndSalary,
      monthEndBenefits: data.monthEndBenefits,
      netTotal: data.netTotal,
      remainingBalance: data.remainingBalance,
    });
    setIsEditing(false);
  };

  const monthStartTotal = 
    parseFloat(editData.monthStartSalary) + 
    parseFloat(editData.monthStartFgts) + 
    parseFloat(editData.monthStartBonuses);

  const monthEndTotal = 
    parseFloat(editData.monthEndSalary) + 
    parseFloat(editData.monthEndBenefits);

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="section-title">Receitas e Saldo</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Start Card */}
        <div className="financial-card">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Meio do Mês</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Salário</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editData.monthStartSalary}
                  onChange={(e) => setEditData({ ...editData, monthStartSalary: e.target.value })}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white currency">{formatCurrency(editData.monthStartSalary)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">FGTS</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editData.monthStartFgts}
                  onChange={(e) => setEditData({ ...editData, monthStartFgts: e.target.value })}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white currency">{formatCurrency(editData.monthStartFgts)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Prêmios</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editData.monthStartBonuses}
                  onChange={(e) => setEditData({ ...editData, monthStartBonuses: e.target.value })}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white currency">{formatCurrency(editData.monthStartBonuses)}</span>
              )}
            </div>
            <div className="pt-3 border-t border-slate-700 flex justify-between font-semibold">
              <span className="text-slate-300">Total</span>
              <span className="text-white">{formatCurrency(monthStartTotal.toString())}</span>
            </div>
          </div>
        </div>

        {/* Monthly End Card */}
        <div className="financial-card">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Fim do Mês</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Salário</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editData.monthEndSalary}
                  onChange={(e) => setEditData({ ...editData, monthEndSalary: e.target.value })}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white currency">{formatCurrency(editData.monthEndSalary)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Benefícios</span>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={editData.monthEndBenefits}
                  onChange={(e) => setEditData({ ...editData, monthEndBenefits: e.target.value })}
                  className="w-24 h-6 text-xs text-right bg-slate-700 border-slate-600 text-white"
                />
              ) : (
                <span className="text-white currency">{formatCurrency(editData.monthEndBenefits)}</span>
              )}
            </div>
            <div className="pt-3 border-t border-slate-700 flex justify-between font-semibold">
              <span className="text-slate-300">Total</span>
              <span className="text-white">{formatCurrency(monthEndTotal.toString())}</span>
            </div>
          </div>
        </div>

        {/* Net Total Card */}
        <div className="bg-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-100 text-sm font-medium">Total Líquido</h3>
            <TrendingUp className="w-4 h-4 text-green-200" />
          </div>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editData.netTotal}
              onChange={(e) => setEditData({ ...editData, netTotal: e.target.value })}
              className="text-3xl font-bold mb-1 bg-green-700 border-green-400 text-white"
            />
          ) : (
            <div className="text-3xl font-bold mb-1">{formatCurrency(editData.netTotal)}</div>
          )}
          <p className="text-green-200 text-sm">Receita total mensal</p>
        </div>

        {/* Remaining Balance Card */}
        <div className="bg-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-100 text-sm font-medium">Saldo Restante</h3>
            <TrendingUp className="w-4 h-4 text-blue-200" />
          </div>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              value={editData.remainingBalance}
              onChange={(e) => setEditData({ ...editData, remainingBalance: e.target.value })}
              className="text-3xl font-bold mb-1 bg-blue-700 border-blue-400 text-white"
            />
          ) : (
            <div className="text-3xl font-bold mb-1">{formatCurrency(editData.remainingBalance)}</div>
          )}
          <p className="text-blue-200 text-sm">Após todos os gastos</p>
        </div>
      </div>
    </section>
  );
}