import { financialData, expenseCategories, monthlySummary, type FinancialData, type ExpenseCategory, type MonthlySummary, type InsertFinancialData, type InsertExpenseCategory, type InsertMonthlySummary, type DashboardData } from "@shared/schema";

export interface IStorage {
  getDashboardData(): Promise<DashboardData | null>;
  createFinancialData(data: InsertFinancialData): Promise<FinancialData>;
  createExpenseCategory(data: InsertExpenseCategory): Promise<ExpenseCategory>;
  createMonthlySummary(data: InsertMonthlySummary): Promise<MonthlySummary>;
  updateFinancialData(data: Partial<FinancialData>): Promise<FinancialData>;
  updateExpenseCategories(categories: ExpenseCategory[]): Promise<ExpenseCategory[]>;
  updateMonthlySummary(data: Partial<MonthlySummary>): Promise<MonthlySummary>;
}

export class MemStorage implements IStorage {
  private financialDataStore: Map<number, FinancialData> = new Map();
  private expenseCategoriesStore: Map<number, ExpenseCategory> = new Map();
  private monthlySummaryStore: Map<number, MonthlySummary> = new Map();
  private currentFinancialId = 1;
  private currentExpenseCategoryId = 1;
  private currentMonthlySummaryId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create initial financial data
    const initialFinancialData: FinancialData = {
      id: 1,
      monthStartSalary: "3700.00",
      monthStartFgts: "200.00",
      monthStartBonuses: "781.31",
      monthEndSalary: "3700.00",
      monthEndBenefits: "1485.00",
      netTotal: "9876.31",
      remainingBalance: "2631.31",
      createdAt: new Date(),
    };

    const initialExpenseCategories: ExpenseCategory[] = [
      {
        id: 1,
        financialDataId: 1,
        categoryType: "essential",
        percentage: 70,
        plannedAmount: "5569.20",
        actualAmount: "5344.54",
        budgetStatus: "under",
      },
      {
        id: 2,
        financialDataId: 1,
        categoryType: "non_essential",
        percentage: 8,
        plannedAmount: "636.06",
        actualAmount: "950.00",
        budgetStatus: "over",
      },
      {
        id: 3,
        financialDataId: 1,
        categoryType: "investments",
        percentage: 17,
        plannedAmount: "1350.00",
        actualAmount: "1350.00",
        budgetStatus: "exact",
      },
      {
        id: 4,
        financialDataId: 1,
        categoryType: "leisure",
        percentage: 5,
        plannedAmount: "397.53",
        actualAmount: "281.30",
        budgetStatus: "under",
      },
    ];

    const initialMonthlySummary: MonthlySummary = {
      id: 1,
      financialDataId: 1,
      totalPlanned: "7952.78",
      totalSpent: "7925.84",
      variance: "-26.94",
      variancePercentage: "-0.34",
    };

    this.financialDataStore.set(1, initialFinancialData);
    initialExpenseCategories.forEach(category => {
      this.expenseCategoriesStore.set(category.id, category);
    });
    this.monthlySummaryStore.set(1, initialMonthlySummary);

    this.currentFinancialId = 2;
    this.currentExpenseCategoryId = 5;
    this.currentMonthlySummaryId = 2;
  }

  async getDashboardData(): Promise<DashboardData | null> {
    const financialData = this.financialDataStore.get(1);
    if (!financialData) return null;

    const expenseCategories = Array.from(this.expenseCategoriesStore.values())
      .filter(category => category.financialDataId === financialData.id);
    
    const monthlySummary = this.monthlySummaryStore.get(1);
    if (!monthlySummary) return null;

    return {
      financialData,
      expenseCategories,
      monthlySummary,
    };
  }

  async createFinancialData(data: InsertFinancialData): Promise<FinancialData> {
    const id = this.currentFinancialId++;
    const financialData: FinancialData = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.financialDataStore.set(id, financialData);
    return financialData;
  }

  async createExpenseCategory(data: InsertExpenseCategory): Promise<ExpenseCategory> {
    const id = this.currentExpenseCategoryId++;
    const expenseCategory: ExpenseCategory = {
      ...data,
      id,
    };
    this.expenseCategoriesStore.set(id, expenseCategory);
    return expenseCategory;
  }

  async createMonthlySummary(data: InsertMonthlySummary): Promise<MonthlySummary> {
    const id = this.currentMonthlySummaryId++;
    const summary: MonthlySummary = {
      ...data,
      id,
    };
    this.monthlySummaryStore.set(id, summary);
    return summary;
  }

  async updateFinancialData(data: Partial<FinancialData>): Promise<FinancialData> {
    const existing = this.financialDataStore.get(1);
    if (!existing) throw new Error("Financial data not found");
    
    const updated = { ...existing, ...data };
    this.financialDataStore.set(1, updated);
    return updated;
  }

  async updateExpenseCategories(categories: ExpenseCategory[]): Promise<ExpenseCategory[]> {
    categories.forEach(category => {
      this.expenseCategoriesStore.set(category.id, category);
    });
    return categories;
  }

  async updateMonthlySummary(data: Partial<MonthlySummary>): Promise<MonthlySummary> {
    const existing = this.monthlySummaryStore.get(1);
    if (!existing) throw new Error("Monthly summary not found");
    
    const updated = { ...existing, ...data };
    this.monthlySummaryStore.set(1, updated);
    return updated;
  }
}

export const storage = new MemStorage();
