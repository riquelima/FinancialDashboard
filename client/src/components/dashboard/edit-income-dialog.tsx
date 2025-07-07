import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IncomeData } from "@shared/schema";
import { Edit } from "lucide-react";

interface EditIncomeDialogProps {
  incomeData: IncomeData;
  onSave: (data: IncomeData) => void;
  isLoading?: boolean;
}

export function EditIncomeDialog({ incomeData, onSave, isLoading }: EditIncomeDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IncomeData>(incomeData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  const updateField = (path: string, value: number) => {
    const pathArray = path.split('.');
    const newData = { ...formData };
    let current: any = newData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;

    setFormData(newData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar Receita
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md dialog-content">
        <DialogHeader>
          <DialogTitle>Editar Dados de Receita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Meio do Mês</h4>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="salary-mid">Salário</Label>
                  <Input
                    id="salary-mid"
                    type="number"
                    step="0.01"
                    value={formData.midMonth.salary}
                    onChange={(e) => updateField('midMonth.salary', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="fgts-mid">FGTS</Label>
                  <Input
                    id="fgts-mid"
                    type="number"
                    step="0.01"
                    value={formData.midMonth.fgts}
                    onChange={(e) => updateField('midMonth.fgts', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="privacy-mid">Privacy</Label>
                  <Input
                    id="privacy-mid"
                    type="number"
                    step="0.01"
                    value={formData.midMonth.privacy}
                    onChange={(e) => updateField('midMonth.privacy', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Fim do Mês</h4>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="salary-end">Salário</Label>
                  <Input
                    id="salary-end"
                    type="number"
                    step="0.01"
                    value={formData.endMonth.salary}
                    onChange={(e) => updateField('endMonth.salary', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits-end">Benefícios</Label>
                  <Input
                    id="benefits-end"
                    type="number"
                    step="0.01"
                    value={formData.endMonth.benefits}
                    onChange={(e) => updateField('endMonth.benefits', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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