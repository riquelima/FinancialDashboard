import { Card, CardContent } from "@/components/ui/card";
import { ExpenseCategory } from "@shared/schema";
import { formatCurrency, getStatusBadgeClass, getProgressPercentage, getVariationText } from "@/lib/financial-data";
import { EditExpenseDialog } from "@/components/dashboard/edit-expense-dialog";
import { DeleteExpenseDialog } from "@/components/dashboard/delete-expense-dialog";
import { AddExpenseDialog } from "@/components/dashboard/add-expense-dialog";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ExpenseCategoriesBlockProps {
  expenses: ExpenseCategory[];
}

export function ExpenseCategoriesBlock({ expenses }: ExpenseCategoriesBlockProps) {
  const { createExpense, updateExpense, deleteExpense, isUpdating, isDeleting, isCreating } = useFinancialData();
  const { toast } = useToast();
  
  // Sort expenses by real amount (highest to lowest)
  const sortedExpenses = [...expenses].sort((a, b) => b.real - a.real);

  const handleSaveExpense = (categoryId: string, data: Partial<ExpenseCategory>) => {
    updateExpense({ categoryId, data });
  };

  const handleDeleteExpense = (categoryId: string) => {
    deleteExpense(categoryId);
  };

  const handleAddExpense = (data: Omit<ExpenseCategory, 'id' | 'status'>) => {
    createExpense(data);
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">📊 Gastos por Categoria</h2>
        <AddExpenseDialog 
          onAdd={handleAddExpense}
          isLoading={isCreating}
        />
      </div>
      {/* Mobile: Carrossel horizontal */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-1">
            {expenses.map((expense) => (
              <Card key={expense.id} className="dashboard-card w-80 flex-shrink-0">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{expense.icon}</span>
                      <h3 className="text-base font-medium text-gray-200">{expense.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`status-badge ${getStatusBadgeClass(expense.status)}`}>
                        {expense.status === 'below' && 'Abaixo do Orçamento'}
                        {expense.status === 'above' && 'Acima do Orçamento'}
                        {expense.status === 'onTarget' && 'No Limite'}
                      </div>
                      <div className="flex gap-1">
                        <EditExpenseDialog 
                          expense={expense} 
                          onSave={handleSaveExpense}
                          isLoading={isUpdating}
                        />
                        <DeleteExpenseDialog 
                          expense={expense} 
                          onDelete={handleDeleteExpense}
                          isLoading={isDeleting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Porcentagem</span>
                      <span className="text-white font-medium">{expense.percentage}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Planejado</span>
                      <span className="text-white font-medium">{formatCurrency(expense.planned)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Gasto Real</span>
                      <span className={`font-medium ${
                        expense.status === 'below' ? 'text-green-400' : 
                        expense.status === 'above' ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                        {formatCurrency(expense.real)}
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${expense.status}`}
                        style={{ width: `${getProgressPercentage(expense.planned, expense.real)}%` }}
                      ></div>
                    </div>

                    <div className="text-sm text-gray-400">
                      {getVariationText(expense.planned, expense.real)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {expenses.map((expense) => (
          <Card key={expense.id} className="dashboard-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">{expense.icon}</span>
                  <h3 className="text-base md:text-lg font-medium text-gray-200">{expense.name}</h3>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <div className={`status-badge ${getStatusBadgeClass(expense.status)}`}>
                    {expense.status === 'below' && 'Abaixo do Orçamento'}
                    {expense.status === 'above' && 'Acima do Orçamento'}
                    {expense.status === 'onTarget' && 'No Limite'}
                  </div>
                  <div className="flex gap-1">
                    <EditExpenseDialog 
                      expense={expense} 
                      onSave={handleSaveExpense}
                      isLoading={isUpdating}
                    />
                    <DeleteExpenseDialog 
                      expense={expense} 
                      onDelete={handleDeleteExpense}
                      isLoading={isDeleting}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Porcentagem</span>
                  <span className="text-white font-medium">{expense.percentage}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Planejado</span>
                  <span className="text-white font-medium">{formatCurrency(expense.planned)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gasto Real</span>
                  <span className={`font-medium ${
                    expense.status === 'below' ? 'text-green-400' : 
                    expense.status === 'above' ? 'text-red-400' : 
                    'text-yellow-400'
                  }`}>
                    {formatCurrency(expense.real)}
                  </span>
                </div>

                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${expense.status}`}
                    style={{ width: `${getProgressPercentage(expense.planned, expense.real)}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-400">
                  {getVariationText(expense.planned, expense.real)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}