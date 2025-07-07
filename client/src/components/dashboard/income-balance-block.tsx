import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IncomeData } from "@shared/schema";
import { formatCurrency } from "@/lib/financial-data";
import { DollarSign, TrendingUp, PiggyBank, Wallet } from "lucide-react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { EditIncomeDialog } from "@/components/dashboard/edit-income-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface IncomeBalanceBlockProps {
  incomeData: IncomeData;
}

export function IncomeBalanceBlock({ incomeData }: IncomeBalanceBlockProps) {
  const { updateIncome, isUpdating } = useFinancialData();

  const handleSaveIncome = (data: IncomeData) => {
    updateIncome(data);
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">💰 Receitas e Saldo</h2>
        <EditIncomeDialog 
          incomeData={incomeData} 
          onSave={handleSaveIncome}
          isLoading={isUpdating}
        />
      </div>
      {/* Mobile: Carrossel horizontal */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-1">
            {/* Mid-Month Income Card */}
            <Card className="dashboard-card w-80 flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-200">Meio do Mês</h3>
                  <span className="text-green-400 text-sm font-medium">15º dia</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salário</span>
                    <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.salary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">FGTS</span>
                    <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.fgts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Privacy</span>
                    <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.privacy)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-200 font-medium">Total</span>
                      <span className="text-green-400 font-semibold">{formatCurrency(incomeData.midMonth.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* End-of-Month Income Card */}
            <Card className="dashboard-card w-80 flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-200">Fim do Mês</h3>
                  <span className="text-green-400 text-sm font-medium">30º dia</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salário</span>
                    <span className="text-white font-medium">{formatCurrency(incomeData.endMonth.salary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Benefícios</span>
                    <span className="text-white font-medium">{formatCurrency(incomeData.endMonth.benefits)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-200 font-medium">Total</span>
                      <span className="text-green-400 font-semibold">{formatCurrency(incomeData.endMonth.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Balance Card */}
            <Card className="dashboard-card bg-gradient-to-br from-green-600 to-green-700 w-80 flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Total Líquido</h3>
                  <DollarSign className="w-6 h-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(incomeData.totalLiquid)}</div>
                <p className="text-green-100 text-sm">Receita total mensal</p>
              </CardContent>
            </Card>

            {/* Remaining Balance Card */}
            <Card className="dashboard-card bg-gradient-to-br from-blue-600 to-blue-700 w-80 flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Saldo Restante</h3>
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(incomeData.remainingBalance)}</div>
                <p className="text-blue-100 text-sm">Após todos os gastos</p>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mid-Month Income Card */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Meio do Mês</h3>
              <span className="text-green-400 text-sm font-medium">15º dia</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Salário</span>
                <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.salary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">FGTS</span>
                <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.fgts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Privacy</span>
                <span className="text-white font-medium">{formatCurrency(incomeData.midMonth.privacy)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-200 font-medium">Total</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(incomeData.midMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* End-of-Month Income Card */}
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Fim do Mês</h3>
              <span className="text-green-400 text-sm font-medium">30º dia</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Salário</span>
                <span className="text-white font-medium">{formatCurrency(incomeData.endMonth.salary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Benefícios</span>
                <span className="text-white font-medium">{formatCurrency(incomeData.endMonth.benefits)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-200 font-medium">Total</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(incomeData.endMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Balance Card */}
        <Card className="dashboard-card bg-gradient-to-br from-green-600 to-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Total Líquido</h3>
              <DollarSign className="w-6 h-6 text-green-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{formatCurrency(incomeData.totalLiquid)}</div>
            <p className="text-green-100 text-sm">Receita total mensal</p>
          </CardContent>
        </Card>

        {/* Remaining Balance Card */}
        <Card className="dashboard-card bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Saldo Restante</h3>
              <TrendingUp className="w-6 h-6 text-blue-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{formatCurrency(incomeData.remainingBalance)}</div>
            <p className="text-blue-100 text-sm">Após todos os gastos</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}