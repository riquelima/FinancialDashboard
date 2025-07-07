
import { users, type User, type InsertUser, type FinancialData, type ExpenseCategory, type IncomeData } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Financial data CRUD methods
  getFinancialData(): Promise<any>;
  createFinancialData(data: any): Promise<any>;
  updateFinancialData(data: any): Promise<any>;
  updateIncomeData(incomeData: IncomeData): Promise<any>;
  createExpenseCategory(categoryData: Omit<ExpenseCategory, 'id' | 'status'>): Promise<any>;
  updateExpenseCategory(categoryId: string, categoryData: Partial<ExpenseCategory>): Promise<any>;
  deleteExpenseCategory(categoryId: string): Promise<any>;
  deleteFinancialData(): Promise<void>;
  refreshFinancialData(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private financialData: any;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize with mock data
    this.financialData = {
      income: {
        midMonth: {
          salary: 3700.00,
          fgts: 200.00,
          privacy: 791.31,
          total: 4691.31
        },
        endMonth: {
          salary: 3700.00,
          benefits: 1485.00,
          total: 5185.00
        },
        totalLiquid: 9876.31,
        remainingBalance: 2631.31
      },
      expenses: [
        {
          id: "essenciais",
          name: "Gastos Essenciais",
          icon: "💡",
          percentage: 70,
          planned: 5569.20,
          real: 5344.54,
          status: "below" as const
        },
        {
          id: "nao_essenciais",
          name: "Gastos Não Essenciais",
          icon: "🍕",
          percentage: 8,
          planned: 636.05,
          real: 950.00,
          status: "above" as const
        },
        {
          id: "investimentos",
          name: "Investimentos",
          icon: "📈",
          percentage: 17,
          planned: 1350.00,
          real: 1350.00,
          status: "onTarget" as const
        },
        {
          id: "torrar",
          name: "Torrar",
          icon: "😎",
          percentage: 5,
          planned: 397.53,
          real: 281.30,
          status: "below" as const
        }
      ]
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFinancialData(): Promise<any> {
    // Recalculate totals and status
    this.recalculateData();
    return this.financialData;
  }

  async createFinancialData(data: any): Promise<any> {
    this.financialData = data;
    this.recalculateData();
    return this.financialData;
  }

  async updateFinancialData(data: any): Promise<any> {
    this.financialData = { ...this.financialData, ...data };
    this.recalculateData();
    return this.financialData;
  }

  async updateIncomeData(incomeData: IncomeData): Promise<any> {
    this.financialData.income = incomeData;
    this.recalculateData();
    return this.financialData;
  }

  async createExpenseCategory(categoryData: Omit<ExpenseCategory, 'id' | 'status'>): Promise<any> {
    const newId = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newExpense: ExpenseCategory = {
      ...categoryData,
      id: newId,
      status: categoryData.real < categoryData.planned ? 'below' : 
             categoryData.real > categoryData.planned ? 'above' : 'onTarget'
    };
    
    if (!this.financialData.expenses) {
      this.financialData.expenses = [];
    }
    
    this.financialData.expenses.push(newExpense);
    this.recalculateData();
    return this.financialData;
  }

  async updateExpenseCategory(categoryId: string, categoryData: Partial<ExpenseCategory>): Promise<any> {
    const expenseIndex = this.financialData.expenses.findIndex(
      (exp: ExpenseCategory) => exp.id === categoryId
    );
    
    if (expenseIndex !== -1) {
      this.financialData.expenses[expenseIndex] = {
        ...this.financialData.expenses[expenseIndex],
        ...categoryData
      };
      
      // Recalculate status based on planned vs real
      const expense = this.financialData.expenses[expenseIndex];
      if (expense.real < expense.planned) {
        expense.status = "below";
      } else if (expense.real > expense.planned) {
        expense.status = "above";
      } else {
        expense.status = "onTarget";
      }
    }
    
    this.recalculateData();
    return this.financialData;
  }

  async deleteExpenseCategory(categoryId: string): Promise<any> {
    const expenseIndex = this.financialData.expenses.findIndex(
      (exp: ExpenseCategory) => exp.id === categoryId
    );
    
    if (expenseIndex !== -1) {
      this.financialData.expenses.splice(expenseIndex, 1);
    }
    
    this.recalculateData();
    return this.financialData;
  }

  async deleteFinancialData(): Promise<void> {
    this.financialData = {
      income: {
        midMonth: { salary: 0, fgts: 0, privacy: 0, total: 0 },
        endMonth: { salary: 0, benefits: 0, total: 0 },
        totalLiquid: 0,
        remainingBalance: 0
      },
      expenses: []
    };
  }

  async refreshFinancialData(): Promise<any> {
    // Simulate refreshing data from external source
    this.recalculateData();
    return this.financialData;
  }

  private recalculateData(): void {
    // Recalculate income totals
    const { midMonth, endMonth } = this.financialData.income;
    midMonth.total = midMonth.salary + midMonth.fgts + midMonth.privacy;
    endMonth.total = endMonth.salary + endMonth.benefits;
    this.financialData.income.totalLiquid = midMonth.total + endMonth.total;
    
    // Calculate total expenses
    const totalExpenses = this.financialData.expenses.reduce(
      (sum: number, exp: ExpenseCategory) => sum + exp.real, 0
    );
    
    this.financialData.income.remainingBalance = 
      this.financialData.income.totalLiquid - totalExpenses;
  }
}

export const storage = new MemStorage();
