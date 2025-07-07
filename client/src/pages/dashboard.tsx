import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import type { DashboardData, FinancialData, ExpenseCategory, MonthlySummary } from "@shared/schema";
import EditableRevenueBalanceSection from "@/components/editable-revenue-balance";
import EditableExpensesByCategory from "@/components/editable-expenses-by-category";
import EditableInvestmentsAndSpending from "@/components/editable-investments-and-spending";
import VisualAnalysis from "@/components/visual-analysis";
import EditableMonthlySummary from "@/components/editable-monthly-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const queryClient = useQueryClient();
  
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
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

  const updateCategoriesMutation = useMutation({
    mutationFn: async (categories: ExpenseCategory[]) => {
      const response = await fetch("/api/expense-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      if (!response.ok) throw new Error("Failed to update categories");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  const updateMonthlySummaryMutation = useMutation({
    mutationFn: async (summary: Partial<MonthlySummary>) => {
      const response = await fetch("/api/monthly-summary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      if (!response.ok) throw new Error("Failed to update monthly summary");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  const handleFinancialDataSave = (data: Partial<FinancialData>) => {
    updateFinancialDataMutation.mutate(data);
  };

  const handleCategoriesSave = (categories: ExpenseCategory[]) => {
    updateCategoriesMutation.mutate(categories);
  };

  const handleMonthlySummarySave = (summary: Partial<MonthlySummary>) => {
    updateMonthlySummaryMutation.mutate(summary);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 bg-slate-700" />
              <Skeleton className="h-4 w-80 mt-2 bg-slate-700" />
            </div>
            <Skeleton className="h-10 w-32 bg-slate-700" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            <Skeleton className="h-64 w-full bg-slate-850" />
            <Skeleton className="h-48 w-full bg-slate-850" />
            <Skeleton className="h-96 w-full bg-slate-850" />
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Financeiro</h1>
            <p className="text-slate-400 text-sm mt-1">Controle suas finanças de forma inteligente</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="w-5 h-5 mr-2" />
            Analisar Dados
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <EditableRevenueBalanceSection 
          data={dashboardData.financialData} 
          onSave={handleFinancialDataSave}
        />
        <EditableExpensesByCategory 
          categories={dashboardData.expenseCategories} 
          onSave={handleCategoriesSave}
        />
        <EditableInvestmentsAndSpending 
          categories={dashboardData.expenseCategories} 
          onSave={handleCategoriesSave}
        />
        <VisualAnalysis categories={dashboardData.expenseCategories} />
        <EditableMonthlySummary 
          summary={dashboardData.monthlySummary} 
          onSave={handleMonthlySummarySave}
        />
      </main>
    </div>
  );
}
