import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExpenseCategory } from "@shared/schema";
import { Trash2 } from "lucide-react";

interface DeleteExpenseDialogProps {
  expense: ExpenseCategory;
  onDelete: (categoryId: string) => void;
  isLoading?: boolean;
}

export function DeleteExpenseDialog({ expense, onDelete, isLoading }: DeleteExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(expense.id);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a categoria "{expense.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deletando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}