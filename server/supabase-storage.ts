
import { supabase } from './supabase';
import { IStorage } from './storage';
import { type User, type InsertUser, type ExpenseCategory, type IncomeData } from "@shared/schema";

export class SupabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async getFinancialData(): Promise<any> {
    const { data, error } = await supabase
      .from('financial_data')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching financial data:', error);
      return this.getDefaultFinancialData();
    }

    if (!data || data.length === 0) {
      return this.getDefaultFinancialData();
    }

    const record = data[0];
    return this.transformToFrontendFormat(record);
  }

  async createFinancialData(data: any): Promise<any> {
    const record = this.transformToDbFormat(data);
    
    const { data: insertedData, error } = await supabase
      .from('financial_data')
      .insert([record])
      .select()
      .single();

    if (error) throw new Error(`Failed to create financial data: ${error.message}`);
    return this.transformToFrontendFormat(insertedData);
  }

  async updateFinancialData(data: any): Promise<any> {
    const { data: existingData } = await supabase
      .from('financial_data')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1);

    if (existingData && existingData.length > 0) {
      const record = this.transformToDbFormat(data);
      const { data: updatedData, error } = await supabase
        .from('financial_data')
        .update(record)
        .eq('id', existingData[0].id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update financial data: ${error.message}`);
      return this.transformToFrontendFormat(updatedData);
    } else {
      return this.createFinancialData(data);
    }
  }

  async updateIncomeData(incomeData: IncomeData): Promise<any> {
    const currentData = await this.getFinancialData();
    currentData.income = incomeData;
    return this.updateFinancialData(currentData);
  }

  async createExpenseCategory(categoryData: Omit<ExpenseCategory, 'id' | 'status'>): Promise<any> {
    const currentData = await this.getFinancialData();
    const newId = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newExpense: ExpenseCategory = {
      ...categoryData,
      id: newId,
      status: categoryData.real < categoryData.planned ? 'below' : 
             categoryData.real > categoryData.planned ? 'above' : 'onTarget'
    };
    
    if (!currentData.expenses) {
      currentData.expenses = [];
    }
    
    currentData.expenses.push(newExpense);
    return this.updateFinancialData(currentData);
  }

  async updateExpenseCategory(categoryId: string, categoryData: Partial<ExpenseCategory>): Promise<any> {
    const currentData = await this.getFinancialData();
    const expenseIndex = currentData.expenses.findIndex(
      (exp: ExpenseCategory) => exp.id === categoryId
    );
    
    if (expenseIndex !== -1) {
      currentData.expenses[expenseIndex] = {
        ...currentData.expenses[expenseIndex],
        ...categoryData
      };
      
      const expense = currentData.expenses[expenseIndex];
      if (expense.real < expense.planned) {
        expense.status = "below";
      } else if (expense.real > expense.planned) {
        expense.status = "above";
      } else {
        expense.status = "onTarget";
      }
    }
    
    return this.updateFinancialData(currentData);
  }

  async deleteExpenseCategory(categoryId: string): Promise<any> {
    const currentData = await this.getFinancialData();
    const expenseIndex = currentData.expenses.findIndex(
      (exp: ExpenseCategory) => exp.id === categoryId
    );
    
    if (expenseIndex !== -1) {
      currentData.expenses.splice(expenseIndex, 1);
    }
    
    return this.updateFinancialData(currentData);
  }

  async deleteFinancialData(): Promise<void> {
    const { error } = await supabase
      .from('financial_data')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) throw new Error(`Failed to delete financial data: ${error.message}`);
  }

  async refreshFinancialData(): Promise<any> {
    return this.getFinancialData();
  }

  private getDefaultFinancialData() {
    return {
      income: {
        midMonth: {
          salary: 0,
          fgts: 0,
          privacy: 0,
          total: 0
        },
        endMonth: {
          salary: 0,
          benefits: 0,
          total: 0
        },
        totalLiquid: 0,
        remainingBalance: 0
      },
      expenses: []
    };
  }

  private transformToDbFormat(frontendData: any) {
    const currentDate = new Date();
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const record: any = {
      month: monthNames[currentDate.getMonth()],
      year: currentDate.getFullYear(),
      salario_meio: frontendData.income?.midMonth?.salary || 0,
      fgts_meio: frontendData.income?.midMonth?.fgts || 0,
      privacy_meio: frontendData.income?.midMonth?.privacy || 0,
      salario_fim: frontendData.income?.endMonth?.salary || 0,
      beneficios_fim: frontendData.income?.endMonth?.benefits || 0,
      essenciais_planejado: 0,
      essenciais_real: 0,
      nao_essenciais_planejado: 0,
      nao_essenciais_real: 0,
      investimentos_planejado: 0,
      investimentos_real: 0,
      torrar_planejado: 0,
      torrar_real: 0
    };

    // Map expenses to database fields
    if (frontendData.expenses) {
      frontendData.expenses.forEach((expense: ExpenseCategory) => {
        switch (expense.id) {
          case 'essenciais':
            record.essenciais_planejado = expense.planned;
            record.essenciais_real = expense.real;
            break;
          case 'nao_essenciais':
            record.nao_essenciais_planejado = expense.planned;
            record.nao_essenciais_real = expense.real;
            break;
          case 'investimentos':
            record.investimentos_planejado = expense.planned;
            record.investimentos_real = expense.real;
            break;
          case 'torrar':
            record.torrar_planejado = expense.planned;
            record.torrar_real = expense.real;
            break;
        }
      });
    }

    return record;
  }

  private transformToFrontendFormat(dbRecord: any) {
    const income = {
      midMonth: {
        salary: parseFloat(dbRecord.salario_meio) || 0,
        fgts: parseFloat(dbRecord.fgts_meio) || 0,
        privacy: parseFloat(dbRecord.privacy_meio) || 0,
        total: 0
      },
      endMonth: {
        salary: parseFloat(dbRecord.salario_fim) || 0,
        benefits: parseFloat(dbRecord.beneficios_fim) || 0,
        total: 0
      },
      totalLiquid: 0,
      remainingBalance: 0
    };

    // Calculate totals
    income.midMonth.total = income.midMonth.salary + income.midMonth.fgts + income.midMonth.privacy;
    income.endMonth.total = income.endMonth.salary + income.endMonth.benefits;
    income.totalLiquid = income.midMonth.total + income.endMonth.total;

    const expenses = [
      {
        id: "essenciais",
        name: "Gastos Essenciais",
        icon: "💡",
        percentage: 70,
        planned: parseFloat(dbRecord.essenciais_planejado) || 0,
        real: parseFloat(dbRecord.essenciais_real) || 0,
        status: this.calculateStatus(
          parseFloat(dbRecord.essenciais_real) || 0,
          parseFloat(dbRecord.essenciais_planejado) || 0
        )
      },
      {
        id: "nao_essenciais",
        name: "Gastos Não Essenciais",
        icon: "🍕",
        percentage: 8,
        planned: parseFloat(dbRecord.nao_essenciais_planejado) || 0,
        real: parseFloat(dbRecord.nao_essenciais_real) || 0,
        status: this.calculateStatus(
          parseFloat(dbRecord.nao_essenciais_real) || 0,
          parseFloat(dbRecord.nao_essenciais_planejado) || 0
        )
      },
      {
        id: "investimentos",
        name: "Investimentos",
        icon: "📈",
        percentage: 17,
        planned: parseFloat(dbRecord.investimentos_planejado) || 0,
        real: parseFloat(dbRecord.investimentos_real) || 0,
        status: this.calculateStatus(
          parseFloat(dbRecord.investimentos_real) || 0,
          parseFloat(dbRecord.investimentos_planejado) || 0
        )
      },
      {
        id: "torrar",
        name: "Torrar",
        icon: "😎",
        percentage: 5,
        planned: parseFloat(dbRecord.torrar_planejado) || 0,
        real: parseFloat(dbRecord.torrar_real) || 0,
        status: this.calculateStatus(
          parseFloat(dbRecord.torrar_real) || 0,
          parseFloat(dbRecord.torrar_planejado) || 0
        )
      }
    ];

    // Calculate remaining balance
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.real, 0);
    income.remainingBalance = income.totalLiquid - totalExpenses;

    return { income, expenses };
  }

  private calculateStatus(real: number, planned: number): 'below' | 'above' | 'onTarget' {
    if (real < planned) return 'below';
    if (real > planned) return 'above';
    return 'onTarget';
  }
}
