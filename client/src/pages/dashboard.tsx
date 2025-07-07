import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { IncomeBalanceBlock } from "@/components/dashboard/income-balance-block";
import { ExpenseCategoriesBlock } from "@/components/dashboard/expense-categories-block";
import { ChartsBlock } from "@/components/dashboard/charts-block";
import { SummaryStats } from "@/components/dashboard/summary-stats";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useFinancialData } from "@/hooks/use-financial-data";
import { DataActions } from "@/components/dashboard/data-actions";

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

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-400 mb-4">Não foi possível carregar os dados financeiros.</p>
          <Button onClick={handleRefresh} disabled={refreshMutation.isPending}>
            {refreshMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-700 p-6" style={{ backgroundColor: 'var(--dark-surface)' }}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Financeiro</h1>
            <p className="text-gray-400 mt-1">Controle suas finanças de forma inteligente</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors duration-200"
          >
            {refreshMutation.isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-2" />
            )}
            Atualizar Dados
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <IncomeBalanceBlock incomeData={dashboardData.income} />
        <ExpenseCategoriesBlock expenses={dashboardData.expenses} />
        <ChartsBlock expenses={dashboardData.expenses} />
        <SummaryStats expenses={dashboardData.expenses} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 p-6 mt-12" style={{ backgroundColor: 'var(--dark-surface)' }}>
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Dashboard Financeiro - Desenvolvido com ❤️ para controle financeiro pessoal
          </p>
        </div>
      </footer>
    </div>
  );
}