import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpenseCategory } from "@shared/schema";
import { Plus } from "lucide-react";

interface AddExpenseDialogProps {
  onAdd: (data: Omit<ExpenseCategory, 'id' | 'status'>) => void;
  isLoading?: boolean;
}

export function AddExpenseDialog({ onAdd, isLoading }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    percentage: 0,
    planned: 0,
    real: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      icon: "",
      percentage: 0,
      planned: 0,
      real: 0,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md dialog-content">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="icon">Ícone</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Digite um emoji"
              required
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
              required
            />
          </div>

          <div>
            <Label htmlFor="planned">Valor Planejado (R$)</Label>
            <Input
              id="planned"
              type="number"
              step="0.01"
              min="0"
              value={formData.planned}
              onChange={(e) => setFormData({ ...formData, planned: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="real">Valor Real (R$)</Label>
            <Input
              id="real"
              type="number"
              step="0.01"
              min="0"
              value={formData.real}
              onChange={(e) => setFormData({ ...formData, real: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}