import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpenseCategory } from "@shared/schema";
import { Edit } from "lucide-react";

interface EditExpenseDialogProps {
  expense: ExpenseCategory;
  onSave: (categoryId: string, data: Partial<ExpenseCategory>) => void;
  isLoading?: boolean;
}

export function EditExpenseDialog({ expense, onSave, isLoading }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: expense.name,
    icon: expense.icon,
    percentage: expense.percentage,
    planned: expense.planned,
    real: expense.real,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(expense.id, formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md dialog-content">
        <DialogHeader>
          <DialogTitle>Editar {expense.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="icon">Ícone</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Digite um emoji"
            />
          </div>

          <div>
            <Label htmlFor="percentage">Porcentagem (%)</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label htmlFor="planned">Valor Planejado (R$)</Label>
            <Input
              id="planned"
              type="number"
              step="0.01"
              value={formData.planned}
              onChange={(e) => setFormData({ ...formData, planned: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label htmlFor="real">Valor Real (R$)</Label>
            <Input
              id="real"
              type="number"
              step="0.01"
              value={formData.real}
              onChange={(e) => setFormData({ ...formData, real: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              data-variant="outline"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}