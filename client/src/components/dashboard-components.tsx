import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { FinancialData, ExpenseCategory, MonthlySummary } from "@shared/schema";

// Simple UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", variant = "default" }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline";
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === "outline" 
        ? "border border-slate-600 text-slate-300 hover:bg-slate-700"
        : "bg-blue-600 text-white hover:bg-blue-700"
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className = "" }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

// Revenue & Balance Section
export function RevenueBalanceSection({ data }: { data: FinancialData }) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-green-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Receitas & Saldo</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-slate-400 text-sm mb-2">Início do Mês</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Salário:</span>
              <span className="text-white font-medium">{formatCurrency(data.monthStartSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">FGTS:</span>
              <span className="text-white font-medium">{formatCurrency(data.monthStartFgts)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Bônus:</span>
              <span className="text-white font-medium">{formatCurrency(data.monthStartBonuses)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-2">Fim do Mês</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Salário:</span>
              <span className="text-white font-medium">{formatCurrency(data.monthEndSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Benefícios:</span>
              <span className="text-white font-medium">{formatCurrency(data.monthEndBenefits)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-2">Total Líquido</h3>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(data.netTotal)}</p>
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-2">Saldo Restante</h3>
          <p className="text-3xl font-bold text-blue-400">{formatCurrency(data.remainingBalance)}</p>
        </Card>
      </div>
    </section>
  );
}

// Editable Revenue & Balance
export function EditableRevenueBalanceSection({ 
  data, 
  onSave 
}: { 
  data: FinancialData; 
  onSave: (data: Partial<FinancialData>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    monthStartSalary: data.monthStartSalary,
    monthStartFgts: data.monthStartFgts,
    monthStartBonuses: data.monthStartBonuses,
    monthEndSalary: data.monthEndSalary,
    monthEndBenefits: data.monthEndBenefits,
    netTotal: data.netTotal,
    remainingBalance: data.remainingBalance,
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="relative">
        <RevenueBalanceSection data={data} />
        <Button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0"
          variant="outline"
        >
          Editar
        </Button>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-green-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-white">Receitas & Saldo - Editando</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>Salvar</Button>
          <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-slate-400 text-sm mb-4">Início do Mês</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 text-sm mb-1">Salário:</label>
              <Input
                value={formData.monthStartSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, monthStartSalary: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">FGTS:</label>
              <Input
                value={formData.monthStartFgts}
                onChange={(e) => setFormData(prev => ({ ...prev, monthStartFgts: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">Bônus:</label>
              <Input
                value={formData.monthStartBonuses}
                onChange={(e) => setFormData(prev => ({ ...prev, monthStartBonuses: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-4">Fim do Mês</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 text-sm mb-1">Salário:</label>
              <Input
                value={formData.monthEndSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, monthEndSalary: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">Benefícios:</label>
              <Input
                value={formData.monthEndBenefits}
                onChange={(e) => setFormData(prev => ({ ...prev, monthEndBenefits: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-4">Total Líquido</h3>
          <Input
            value={formData.netTotal}
            onChange={(e) => setFormData(prev => ({ ...prev, netTotal: e.target.value }))}
          />
        </Card>

        <Card>
          <h3 className="text-slate-400 text-sm mb-4">Saldo Restante</h3>
          <Input
            value={formData.remainingBalance}
            onChange={(e) => setFormData(prev => ({ ...prev, remainingBalance: e.target.value }))}
          />
        </Card>
      </div>
    </section>
  );
}

// Expenses by Category
export function ExpensesByCategory({ categories }: { categories: ExpenseCategory[] }) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'essential': return 'Essenciais';
      case 'investments': return 'Investimentos';
      case 'non_essential': return 'Não Essenciais';
      case 'leisure': return 'Torrar';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-green-400';
      case 'over': return 'text-red-400';
      case 'exact': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Gastos por Categoria</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <h3 className="text-white font-semibold mb-2">{getCategoryName(category.categoryType)}</h3>
            <p className="text-slate-400 text-sm mb-4">{category.percentage}% do orçamento</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Planejado:</span>
                <span className="text-white">{formatCurrency(category.plannedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Real:</span>
                <span className="text-white">{formatCurrency(category.actualAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getStatusColor(category.budgetStatus)}`}>
                {category.budgetStatus === 'under' && 'Abaixo do orçamento'}
                {category.budgetStatus === 'over' && 'Acima do orçamento'}
                {category.budgetStatus === 'exact' && 'No orçamento'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// Editable Expenses by Category
export function EditableExpensesByCategory({ 
  categories, 
  onSave 
}: { 
  categories: ExpenseCategory[]; 
  onSave: (categories: ExpenseCategory[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(categories);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'essential': return 'Essenciais';
      case 'investments': return 'Investimentos';
      case 'non_essential': return 'Não Essenciais';
      case 'leisure': return 'Torrar';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-green-400';
      case 'over': return 'text-red-400';
      case 'exact': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const updateCategory = (index: number, field: keyof ExpenseCategory, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  if (!isEditing) {
    return (
      <div className="relative">
        <ExpensesByCategory categories={categories} />
        <Button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0"
          variant="outline"
        >
          Editar
        </Button>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-white">Gastos por Categoria - Editando</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>Salvar</Button>
          <Button onClick={() => { setIsEditing(false); setFormData(categories); }} variant="outline">Cancelar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {formData.map((category, index) => (
          <Card key={category.id}>
            <h3 className="text-white font-semibold mb-2">{getCategoryName(category.categoryType)}</h3>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-1">Porcentagem:</label>
              <Input
                value={category.percentage.toString()}
                onChange={(e) => updateCategory(index, 'percentage', e.target.value)}
                placeholder="Porcentagem"
              />
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1">Planejado:</label>
                <Input
                  value={category.plannedAmount}
                  onChange={(e) => updateCategory(index, 'plannedAmount', e.target.value)}
                  placeholder="Valor planejado"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Real:</label>
                <Input
                  value={category.actualAmount}
                  onChange={(e) => updateCategory(index, 'actualAmount', e.target.value)}
                  placeholder="Valor real"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-1">Status:</label>
              <select
                value={category.budgetStatus}
                onChange={(e) => updateCategory(index, 'budgetStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="under">Abaixo do orçamento</option>
                <option value="over">Acima do orçamento</option>
                <option value="exact">No orçamento</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// Visual Analysis
export function VisualAnalysis({ categories }: { categories: ExpenseCategory[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieData = categories.map(category => {
    let label = '';
    switch (category.categoryType) {
      case 'essential': label = 'Essenciais'; break;
      case 'investments': label = 'Investimentos'; break;
      case 'non_essential': label = 'Não Essenciais'; break;
      case 'leisure': label = 'Torrar'; break;
    }
    return {
      name: label,
      value: category.percentage,
      categoryType: category.categoryType,
    };
  });

  const barData = categories.map(category => {
    let label = '';
    switch (category.categoryType) {
      case 'essential': label = 'Essenciais'; break;
      case 'investments': label = 'Investimentos'; break;
      case 'non_essential': label = 'Não Essenciais'; break;
      case 'leisure': label = 'Torrar'; break;
    }
    return {
      name: label,
      planejado: parseFloat(category.plannedAmount),
      real: parseFloat(category.actualAmount),
    };
  });

  const pieColors = {
    essential: '#3B82F6',
    investments: '#10B981',
    non_essential: '#F59E0B',
    leisure: '#8B5CF6',
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Análise Visual</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-white font-semibold mb-4">Distribuição Planejada</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pieColors[entry.categoryType as keyof typeof pieColors]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-4">Planejado vs Real</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Bar dataKey="planejado" fill="#3B82F6" />
                <Bar dataKey="real" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}

// Monthly Summary
export function MonthlySummary({ summary }: { summary: MonthlySummary }) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Resumo Mensal</h2>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-slate-400 text-sm mb-2">Total Planejado</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalPlanned)}</p>
          </div>
          
          <div>
            <h3 className="text-slate-400 text-sm mb-2">Total Gasto</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalSpent)}</p>
          </div>
          
          <div>
            <h3 className="text-slate-400 text-sm mb-2">Variação</h3>
            <p className={`text-2xl font-bold ${parseFloat(summary.variance) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(summary.variance)}
            </p>
          </div>
          
          <div>
            <h3 className="text-slate-400 text-sm mb-2">Variação %</h3>
            <p className={`text-2xl font-bold ${parseFloat(summary.variancePercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {summary.variancePercentage}%
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}