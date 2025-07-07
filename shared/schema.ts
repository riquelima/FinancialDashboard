import { pgTable, text, serial, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  
  // Mid-month income
  salario_meio: decimal("salario_meio", { precision: 10, scale: 2 }).notNull(),
  fgts_meio: decimal("fgts_meio", { precision: 10, scale: 2 }).notNull(),
  privacy_meio: decimal("privacy_meio", { precision: 10, scale: 2 }).notNull(),
  
  // End-month income
  salario_fim: decimal("salario_fim", { precision: 10, scale: 2 }).notNull(),
  beneficios_fim: decimal("beneficios_fim", { precision: 10, scale: 2 }).notNull(),
  
  // Expense categories
  essenciais_planejado: decimal("essenciais_planejado", { precision: 10, scale: 2 }).notNull(),
  essenciais_real: decimal("essenciais_real", { precision: 10, scale: 2 }).notNull(),
  nao_essenciais_planejado: decimal("nao_essenciais_planejado", { precision: 10, scale: 2 }).notNull(),
  nao_essenciais_real: decimal("nao_essenciais_real", { precision: 10, scale: 2 }).notNull(),
  investimentos_planejado: decimal("investimentos_planejado", { precision: 10, scale: 2 }).notNull(),
  investimentos_real: decimal("investimentos_real", { precision: 10, scale: 2 }).notNull(),
  torrar_planejado: decimal("torrar_planejado", { precision: 10, scale: 2 }).notNull(),
  torrar_real: decimal("torrar_real", { precision: 10, scale: 2 }).notNull(),
});

export const insertFinancialDataSchema = createInsertSchema(financialData);
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type FinancialData = typeof financialData.$inferSelect;

// Category type for frontend use
export type ExpenseCategory = {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  planned: number;
  real: number;
  status: 'below' | 'above' | 'onTarget';
};

export type IncomeData = {
  midMonth: {
    salary: number;
    fgts: number;
    privacy: number;
    total: number;
  };
  endMonth: {
    salary: number;
    benefits: number;
    total: number;
  };
  totalLiquid: number;
  remainingBalance: number;
};
