import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchData, updateData } from '@/lib/simple-query';
import type { DashboardData, FinancialData } from "@shared/schema";

// Editable Expense Categories Section
function EditableExpenseCategoriesSection({
  categories,
  onSave,
  formatCurrency
}: {
  categories: any[];
  onSave: (categories: any[]) => void;
  formatCurrency: (value: string | number) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(categories);

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'essential': return 'Essenciais';
      case 'investments': return 'Investimentos';
      case 'non_essential': return 'Não Essenciais';
      case 'leisure': return 'Torrar';
      default: return type;
    }
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <section className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Gastos por Categoria</h2>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">{getCategoryName(category.categoryType)}</h3>
              <p className="text-slate-400 text-sm mb-4">{category.percentage}% do orçamento</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Planejado:</span>
                  <span>{formatCurrency(category.plannedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Real:</span>
                  <span>{formatCurrency(category.actualAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-semibold">Gastos por Categoria - Editando</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Salvar
          </button>
          <button
            onClick={() => { setIsEditing(false); setFormData(categories); }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {formData.map((category, index) => (
          <div key={category.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold mb-4">{getCategoryName(category.categoryType)}</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-sm mb-1">Porcentagem:</label>
                <input
                  type="text"
                  value={category.percentage}
                  onChange={(e) => updateCategory(index, 'percentage', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  placeholder="Porcentagem"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm mb-1">Planejado:</label>
                <input
                  type="text"
                  value={category.plannedAmount}
                  onChange={(e) => updateCategory(index, 'plannedAmount', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  placeholder="Valor planejado"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm mb-1">Real:</label>
                <input
                  type="text"
                  value={category.actualAmount}
                  onChange={(e) => updateCategory(index, 'actualAmount', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  placeholder="Valor real"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">Status:</label>
                <select
                  value={category.budgetStatus}
                  onChange={(e) => updateCategory(index, 'budgetStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option value="under">Abaixo do orçamento</option>
                  <option value="over">Acima do orçamento</option>
                  <option value="exact">No orçamento</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SimpleDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchData<DashboardData>('/api/dashboard');
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateFinancialData = async (data: Partial<FinancialData>) => {
    try {
      await updateData('/api/financial-data', data);
      await loadData(); // Reload data
      setEditMode(false);
    } catch (err) {
      console.error('Error updating financial data:', err);
    }
  };

  const updateExpenseCategories = async (categories: any[]) => {
    try {
      await updateData('/api/expense-categories', categories);
      await loadData(); // Reload data
    } catch (err) {
      console.error('Error updating expense categories:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-700 rounded w-64"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-slate-800 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro</h1>
          <p className="text-slate-400">{error || 'Não foi possível carregar os dados'}</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { financialData, expenseCategories, monthlySummary } = dashboardData;

  // Prepare chart data
  const pieData = expenseCategories.map(category => ({
    name: category.categoryType === 'essential' ? 'Essenciais' :
          category.categoryType === 'investments' ? 'Investimentos' :
          category.categoryType === 'non_essential' ? 'Não Essenciais' : 'Torrar',
    value: category.percentage,
    fill: category.categoryType === 'essential' ? '#3B82F6' :
          category.categoryType === 'investments' ? '#10B981' :
          category.categoryType === 'non_essential' ? '#F59E0B' : '#8B5CF6'
  }));

  const barData = expenseCategories.map(category => ({
    name: category.categoryType === 'essential' ? 'Essenciais' :
          category.categoryType === 'investments' ? 'Investimentos' :
          category.categoryType === 'non_essential' ? 'Não Essenciais' : 'Torrar',
    planejado: parseFloat(category.plannedAmount),
    real: parseFloat(category.actualAmount),
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
            <p className="text-slate-400">Controle suas finanças mensais</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Última atualização</p>
            <p className="font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Revenue & Balance */}
        <section className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold">Receitas & Saldo</h2>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
            )}
          </div>

          {editMode ? (
            <EditForm 
              data={financialData} 
              onSave={updateFinancialData}
              onCancel={() => setEditMode(false)}
              formatCurrency={formatCurrency}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm mb-2">Início do Mês</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Salário:</span>
                    <span className="font-medium">{formatCurrency(financialData.monthStartSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">FGTS:</span>
                    <span className="font-medium">{formatCurrency(financialData.monthStartFgts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Bônus:</span>
                    <span className="font-medium">{formatCurrency(financialData.monthStartBonuses)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm mb-2">Fim do Mês</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Salário:</span>
                    <span className="font-medium">{formatCurrency(financialData.monthEndSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Benefícios:</span>
                    <span className="font-medium">{formatCurrency(financialData.monthEndBenefits)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm mb-2">Total Líquido</h3>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(financialData.netTotal)}</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm mb-2">Saldo Restante</h3>
                <p className="text-3xl font-bold text-blue-400">{formatCurrency(financialData.remainingBalance)}</p>
              </div>
            </div>
          )}
        </section>

        {/* Expense Categories */}
        <EditableExpenseCategoriesSection 
          categories={expenseCategories}
          onSave={updateExpenseCategories}
          formatCurrency={formatCurrency}
        />

        {/* Charts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Análise Visual</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Distribuição Planejada</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Planejado vs Real</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={formatCurrency} />
                    <Bar dataKey="planejado" fill="#3B82F6" />
                    <Bar dataKey="real" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Summary */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Resumo Mensal</h2>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-slate-400 text-sm mb-2">Total Planejado</h3>
                <p className="text-2xl font-bold">{formatCurrency(monthlySummary.totalPlanned)}</p>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-2">Total Gasto</h3>
                <p className="text-2xl font-bold">{formatCurrency(monthlySummary.totalSpent)}</p>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-2">Variação</h3>
                <p className={`text-2xl font-bold ${parseFloat(monthlySummary.variance) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(monthlySummary.variance)}
                </p>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-2">Variação %</h3>
                <p className={`text-2xl font-bold ${parseFloat(monthlySummary.variancePercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {monthlySummary.variancePercentage}%
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

