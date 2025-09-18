import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/components/TransactionCard';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'financial-transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY);
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as transações salvas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save transactions to localStorage when transactions change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving transactions:', error);
        toast({
          title: "Erro ao salvar dados",
          description: "Não foi possível salvar as transações.",
          variant: "destructive",
        });
      }
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((newTransaction: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
    toast({
      title: "Transação adicionada!",
      description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} foi registrada.`,
    });
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast({
      title: "Transação atualizada!",
      description: "As informações foram salvas com sucesso.",
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação removida!",
      description: "A transação foi excluída com sucesso.",
      variant: "destructive",
    });
  }, []);

  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
    toast({
      title: "Dados limpos!",
      description: "Todas as transações foram removidas.",
    });
  }, []);

  const getTransactionsByMonth = useCallback((year: number, month: number) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === month && 
             transactionDate.getFullYear() === year;
    });
  }, [transactions]);

  const getRecurringTransactions = useCallback(() => {
    return transactions.filter(t => t.isRecurring);
  }, [transactions]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    getTransactionsByMonth,
    getRecurringTransactions,
  };
}
