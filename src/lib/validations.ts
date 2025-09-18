import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória').max(100, 'Descrição deve ter no máximo 100 caracteres'),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99, 'Valor muito alto'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Tipo é obrigatório',
  }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().datetime('Data inválida'),
  isRecurring: z.boolean().optional().default(false),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const validateTransaction = (data: unknown) => {
  try {
    return { success: true, data: transactionSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: 'general', message: 'Erro de validação desconhecido' }],
    };
  }
};

export const validateAmount = (value: string): { isValid: boolean; error?: string } => {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Valor deve ser um número válido' };
  }
  
  if (numValue <= 0) {
    return { isValid: false, error: 'Valor deve ser positivo' };
  }
  
  if (numValue > 999999.99) {
    return { isValid: false, error: 'Valor muito alto (máximo: R$ 999.999,99)' };
  }
  
  return { isValid: true };
};

export const validateDescription = (value: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: false, error: 'Descrição é obrigatória' };
  }
  
  if (value.length > 100) {
    return { isValid: false, error: 'Descrição deve ter no máximo 100 caracteres' };
  }
  
  return { isValid: true };
};
