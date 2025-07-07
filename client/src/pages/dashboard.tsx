import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  EditableRevenueBalanceSection, 
  EditableExpensesByCategory, 
  VisualAnalysis, 
  MonthlySummary 
} from "@/components/dashboard-components";
import type { DashboardData, FinancialData, ExpenseCategory, MonthlySummary as MonthlySummaryType } from "@shared/schema";

export default function Dashboard() {
  const queryClient = useQueryClient();
  
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  const updateFinancialDataMutation = useMutation({
    mutationFn: async (data: Partial<FinancialData>) => {
      const response = await fetch("/api/financial-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update financial data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  const updateExpenseCategoriesMutation = useMutation({
    mutationFn: async (categories: ExpenseCategory[]) => {
      const response = await fetch("/api/expense-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      if (!response.ok) throw new Error("Failed to update expense categories");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 w-64 bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-80 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            <div className="h-64 w-full bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-48 w-full bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-96 w-full bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar dados</h1>
          <p className="text-slate-400">Não foi possível carregar os dados do dashboard financeiro.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Financeiro</h1>
            <p className="text-slate-400">Controle suas finanças mensais</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Última atualização</p>
            <p className="text-white font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <EditableRevenueBalanceSection
            data={dashboardData.financialData}
            onSave={(data) => updateFinancialDataMutation.mutate(data)}
          />

          <EditableExpensesByCategory 
            categories={dashboardData.expenseCategories}
            onSave={(categories) => updateExpenseCategoriesMutation.mutate(categories)}
          />

          <VisualAnalysis categories={dashboardData.expenseCategories} />

          <MonthlySummary summary={dashboardData.monthlySummary} />
        </div>
      </main>
    </div>
  );
}