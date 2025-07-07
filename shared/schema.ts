import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  monthStartSalary: decimal("month_start_salary", { precision: 10, scale: 2 }).notNull(),
  monthStartFgts: decimal("month_start_fgts", { precision: 10, scale: 2 }).notNull(),
  monthStartBonuses: decimal("month_start_bonuses", { precision: 10, scale: 2 }).notNull(),
  monthEndSalary: decimal("month_end_salary", { precision: 10, scale: 2 }).notNull(),
  monthEndBenefits: decimal("month_end_benefits", { precision: 10, scale: 2 }).notNull(),
  netTotal: decimal("net_total", { precision: 10, scale: 2 }).notNull(),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  financialDataId: integer("financial_data_id").references(() => financialData.id).notNull(),
  categoryType: text("category_type").notNull(), // 'essential', 'non_essential', 'investments', 'leisure'
  percentage: integer("percentage").notNull(),
  plannedAmount: decimal("planned_amount", { precision: 10, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 10, scale: 2 }).notNull(),
  budgetStatus: text("budget_status").notNull(), // 'under', 'over', 'exact'
});

export const monthlySummary = pgTable("monthly_summary", {
  id: serial("id").primaryKey(),
  financialDataId: integer("financial_data_id").references(() => financialData.id).notNull(),
  totalPlanned: decimal("total_planned", { precision: 10, scale: 2 }).notNull(),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).notNull(),
  variance: decimal("variance", { precision: 10, scale: 2 }).notNull(),
  variancePercentage: decimal("variance_percentage", { precision: 5, scale: 2 }).notNull(),
});

export const insertFinancialDataSchema = createInsertSchema(financialData).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).omit({
  id: true,
});

export const insertMonthlySummarySchema = createInsertSchema(monthlySummary).omit({
  id: true,
});

export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type FinancialData = typeof financialData.$inferSelect;
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertMonthlySummary = z.infer<typeof insertMonthlySummarySchema>;
export type MonthlySummary = typeof monthlySummary.$inferSelect;

export interface DashboardData {
  financialData: FinancialData;
  expenseCategories: ExpenseCategory[];
  monthlySummary: MonthlySummary;
}
