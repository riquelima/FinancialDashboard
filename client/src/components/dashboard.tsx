
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Plus, Edit, Trash2, FileText, CreditCard, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useFinancialData } from "@/hooks/use-financial-data";
import { ExpenseCategory, IncomeData } from "@shared/schema";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const calculateTotals = (expenses: ExpenseCategory[]) => {
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

// Income Balance Component
function IncomeBalance({ incomeData }: { incomeData: IncomeData }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">💰 Balanço de Renda</h2>
      
      {/* Mobile: Cards em stack */}
      <div className="md:hidden space-y-4">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Meio do Mês (15º dia)</h3>
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
                  <span className="text-green-400 font-bold">{formatCurrency(incomeData.midMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Final do Mês (30º dia)</h3>
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
                  <span className="text-green-400 font-bold">{formatCurrency(incomeData.endMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span className="text-green-400 font-bold">{formatCurrency(incomeData.midMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Final do Mês</h3>
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
                  <span className="text-green-400 font-bold">{formatCurrency(incomeData.endMonth.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Renda Líquida</h3>
              <span className="text-blue-400 text-2xl">💼</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(incomeData.totalLiquid)}
            </div>
            <p className="text-gray-400 text-sm">Total mensal disponível</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">Saldo Restante</h3>
              <span className="text-yellow-400 text-2xl">💰</span>
            </div>
            <div className={`text-3xl font-bold mb-2 ${incomeData.remainingBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(incomeData.remainingBalance)}
            </div>
            <p className="text-gray-400 text-sm">
              {incomeData.remainingBalance >= 0 ? 'Sobrou no orçamento' : 'Déficit no orçamento'}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Expense Categories Component
function ExpenseCategories({ expenses }: { expenses: ExpenseCategory[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'below': return 'text-green-400 bg-green-400/10';
      case 'above': return 'text-red-400 bg-red-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'below': return 'Abaixo';
      case 'above': return 'Acima';
      default: return 'No Alvo';
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">🏷️ Categorias de Gastos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expenses.map((expense) => (
          <Card key={expense.id} className="dashboard-card hover:bg-gray-800/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{expense.icon}</span>
                  <h3 className="text-lg font-medium text-gray-200">{expense.name.replace('Gastos ', '')}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                  {getStatusText(expense.status)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Planejado</span>
                  <span className="text-white font-medium">{formatCurrency(expense.planned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gasto</span>
                  <span className="text-white font-medium">{formatCurrency(expense.real)}</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-200">Diferença</span>
                    <span className={`font-bold ${expense.real <= expense.planned ? 'text-green-400' : 'text-red-400'}`}>
                      {expense.real <= expense.planned ? '-' : '+'}{formatCurrency(Math.abs(expense.real - expense.planned))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// Charts Component
function Charts({ expenses }: { expenses: ExpenseCategory[] }) {
  const pieData = expenses.map(expense => ({
    name: expense.name.replace('Gastos ', ''),
    value: expense.planned,
    percentage: expense.percentage
  }));

  const barData = expenses.map(expense => ({
    name: expense.name.replace('Gastos ', ''),
    planejado: expense.planned,
    real: expense.real
  }));

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">📈 Análise Visual</h2>
      
      {/* Mobile: Carrossel horizontal */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-1">
            <Card className="dashboard-card w-80 flex-shrink-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Distribuição Planejada</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          'Valor'
                        ]}
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  {expenses.map((expense, index) => (
                    <div key={expense.id} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-gray-400">{expense.name.replace('Gastos ', '')} ({expense.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card w-80 flex-shrink-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Planejado vs Real</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip 
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          ''
                        ]}
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="planejado" fill="#0088FE" name="Planejado" />
                      <Bar dataKey="real" fill="#FF8042" name="Real" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Distribuição Planejada</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Valor'
                    ]}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {expenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-400">{expense.name.replace('Gastos ', '')} ({expense.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Planejado vs Real</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      ''
                    ]}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="planejado" fill="#0088FE" name="Planejado" />
                  <Bar dataKey="real" fill="#FF8042" name="Real" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Summary Stats Component
function SummaryStats({ expenses }: { expenses: ExpenseCategory[] }) {
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

// Main Dashboard Component
export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: dashboardData, isLoading } = useFinancialData();

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/refresh-data');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial-data'] });
      toast({
        title: "Dados atualizados",
        description: "Os dados do dashboard foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar dados</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">💼 Dashboard Financeiro</h1>
            <p className="text-gray-400">Controle suas finanças de forma inteligente</p>
          </div>
          
          <Button
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
        </div>

        <IncomeBalance incomeData={dashboardData.income} />
        <ExpenseCategories expenses={dashboardData.expenses} />
        <Charts expenses={dashboardData.expenses} />
        <SummaryStats expenses={dashboardData.expenses} />
      </div>
    </div>
  );
}
