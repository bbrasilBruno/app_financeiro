import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle } from "lucide-react";
import { Transaction } from "./TransactionCard";
import { validateAmount, validateDescription } from "@/lib/validations";

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  editingTransaction?: Transaction | null;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onClose?: () => void;
}

const incomeCategories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Vendas",
  "Outros"
];

const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Outros"
];

export function AddTransactionDialog({ 
  onAddTransaction, 
  editingTransaction, 
  onUpdateTransaction, 
  onClose 
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || "");
  const [type, setType] = useState<"income" | "expense">(editingTransaction?.type || "expense");
  const [category, setCategory] = useState(editingTransaction?.category || "");
  const [isRecurring, setIsRecurring] = useState(editingTransaction?.isRecurring || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!editingTransaction;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error!;
    }
    
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error!;
    }
    
    if (!category) {
      newErrors.category = "Categoria é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const transactionData = {
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: editingTransaction?.date || new Date().toISOString(),
      isRecurring,
    };
    
    if (isEditing && editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({
        ...transactionData,
        id: editingTransaction.id,
      });
    } else {
      onAddTransaction(transactionData);
    }
    
    // Reset form
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("");
    setIsRecurring(false);
    setErrors({});
    setOpen(false);
    onClose?.();
  };
  
  const categories = type === "income" ? incomeCategories : expenseCategories;
  
  return (
    <Dialog open={open || !!editingTransaction} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) onClose?.();
    }}>
      <DialogTrigger asChild>
        {!isEditing && (
          <Button 
            className="bg-gradient-primary text-white shadow-elevated hover:opacity-90"
            aria-label="Adicionar nova transação"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Ex: Compras do mercado"
              className={errors.description ? "border-destructive" : ""}
              required
            />
            {errors.description && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.description}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: "" }));
                  }
                }}
                placeholder="0,00"
                className={errors.amount ? "border-destructive" : ""}
                required
              />
              {errors.amount && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.amount}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value: "income" | "expense") => {
                setType(value);
                setCategory(""); // Reset category when type changes
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={category} 
              onValueChange={(value) => {
                setCategory(value);
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: "" }));
                }
              }}
            >
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.category}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring" className="text-sm">
              Transação recorrente (mensal)
            </Label>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary text-white"
            >
              {isEditing ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}