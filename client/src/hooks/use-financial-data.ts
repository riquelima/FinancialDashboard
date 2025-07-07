
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpenseCategory, IncomeData } from "@shared/schema";
import { FinancialDashboardData } from "@/lib/financial-data";

const API_BASE = "/api";

export const useFinancialData = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FinancialDashboardData>({
    queryKey: ["financial-data"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/financial-data`);
      if (!response.ok) {
        throw new Error("Failed to fetch financial data");
      }
      return response.json();
    },
  });

  const updateIncomeMutation = useMutation({
    mutationFn: async (incomeData: IncomeData) => {
      const response = await fetch(`${API_BASE}/financial-data/income`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData),
      });
      if (!response.ok) {
        throw new Error("Failed to update income data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: Partial<ExpenseCategory> }) => {
      const response = await fetch(`${API_BASE}/financial-data/expense/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update expense category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: Omit<ExpenseCategory, 'id' | 'status'>) => {
      const response = await fetch(`${API_BASE}/financial-data/expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create expense category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(`${API_BASE}/financial-data/expense/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete expense category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const createDataMutation = useMutation({
    mutationFn: async (data: FinancialDashboardData) => {
      const response = await fetch(`${API_BASE}/financial-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create financial data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const updateDataMutation = useMutation({
    mutationFn: async (data: Partial<FinancialDashboardData>) => {
      const response = await fetch(`${API_BASE}/financial-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update financial data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const deleteDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/financial-data`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete financial data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/refresh-data`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-data"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    updateIncome: updateIncomeMutation.mutate,
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    createData: createDataMutation.mutate,
    updateData: updateDataMutation.mutate,
    deleteData: deleteDataMutation.mutate,
    refreshData: refreshDataMutation.mutate,
    isUpdating: updateIncomeMutation.isPending || updateExpenseMutation.isPending,
    isCreating: createDataMutation.isPending || createExpenseMutation.isPending,
    isDeleting: deleteDataMutation.isPending || deleteExpenseMutation.isPending,
    isRefreshing: refreshDataMutation.isPending,
  };
};
