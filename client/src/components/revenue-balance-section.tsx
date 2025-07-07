import { TrendingUp } from "lucide-react";
import type { FinancialData } from "@shared/schema";

interface RevenueBalanceSectionProps {
  data: FinancialData;
}

export default function RevenueBalanceSection({ data }: RevenueBalanceSectionProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const monthStartTotal = 
    parseFloat(data.monthStartSalary) + 
    parseFloat(data.monthStartFgts) + 
    parseFloat(data.monthStartBonuses);

  const monthEndTotal = 
    parseFloat(data.monthEndSalary) + 
    parseFloat(data.monthEndBenefits);

  return (
    <section>
      <div className="section-header">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="section-title">Receitas e Saldo</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Start Card */}
        <div className="financial-card">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Meio do Mês</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Salário</span>
              <span className="text-white currency">{formatCurrency(data.monthStartSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">FGTS</span>
              <span className="text-white currency">{formatCurrency(data.monthStartFgts)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Prêmios</span>
              <span className="text-white currency">{formatCurrency(data.monthStartBonuses)}</span>
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
              <span className="text-white currency">{formatCurrency(data.monthEndSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-sm">Benefícios</span>
              <span className="text-white currency">{formatCurrency(data.monthEndBenefits)}</span>
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
          <div className="text-3xl font-bold mb-1">{formatCurrency(data.netTotal)}</div>
          <p className="text-green-200 text-sm">Receita total mensal</p>
        </div>

        {/* Remaining Balance Card */}
        <div className="bg-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-100 text-sm font-medium">Saldo Restante</h3>
            <TrendingUp className="w-4 h-4 text-blue-200" />
          </div>
          <div className="text-3xl font-bold mb-1">{formatCurrency(data.remainingBalance)}</div>
          <p className="text-blue-200 text-sm">Após todos os gastos</p>
        </div>
      </div>
    </section>
  );
}
