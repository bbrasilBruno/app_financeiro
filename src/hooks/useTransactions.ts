import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/components/TransactionCard';
import { toast } from '@/hooks/use-toast';
import { getSupabase, getCurrentUser } from '@/lib/supabaseClient';

const STORAGE_KEY = 'financial-transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnlineMode, setIsOnlineMode] = useState(false);

  // Load transactions from Supabase if authenticated; fallback to localStorage
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const supabase = getSupabase();
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });
          if (error) throw error;
          if (!isMounted) return;
          const mapped: Transaction[] = (data || []).map((row: any) => ({
            id: row.id,
            description: row.description,
            amount: row.amount,
            type: row.type,
            category: row.category,
            date: row.date,
            isRecurring: row.is_recurring ?? false,
          }));
          setTransactions(mapped);
          setIsOnlineMode(true);
        } else {
          const savedTransactions = localStorage.getItem(STORAGE_KEY);
          if (savedTransactions && isMounted) {
            const parsed = JSON.parse(savedTransactions);
            setTransactions(parsed);
          }
          setIsOnlineMode(false);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Tentaremos usar os dados locais.",
          variant: "destructive",
        });
        const savedTransactions = localStorage.getItem(STORAGE_KEY);
        if (savedTransactions && isMounted) {
          const parsed = JSON.parse(savedTransactions);
          setTransactions(parsed);
        }
        setIsOnlineMode(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Save transactions to localStorage when transactions change (offline cache)
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

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, "id">) => {
    const user = await getCurrentUser();
    if (user && isOnlineMode) {
      try {
        const supabase = getSupabase();
        const payload = {
          user_id: user.id,
          description: newTransaction.description.trim(),
          amount: newTransaction.amount,
          type: newTransaction.type,
          category: newTransaction.category,
          date: newTransaction.date || new Date().toISOString(),
          is_recurring: Boolean(newTransaction.isRecurring),
        };
        const { data, error } = await supabase
          .from('transactions')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;
        const created: Transaction = {
          id: data.id,
          description: data.description,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: data.date,
          isRecurring: data.is_recurring ?? false,
        };
        setTransactions(prev => [created, ...prev]);
        toast({
          title: "Transação adicionada!",
          description: `${created.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${created.amount.toFixed(2)} foi registrada.`,
        });
        return;
      } catch (error) {
        console.error('Erro ao inserir na nuvem, usando local:', error);
      }
    }
    // Fallback local
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
    toast({
      title: "Transação adicionada (local)!",
      description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} foi registrada.`,
    });
  }, [isOnlineMode]);

  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    const user = await getCurrentUser();
    if (user && isOnlineMode) {
      try {
        const supabase = getSupabase();
        const payload = {
          description: updatedTransaction.description.trim(),
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          category: updatedTransaction.category,
          date: updatedTransaction.date,
          is_recurring: Boolean(updatedTransaction.isRecurring),
        };
        const { error } = await supabase
          .from('transactions')
          .update(payload)
          .eq('id', updatedTransaction.id);
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao atualizar na nuvem, aplicando local:', error);
      }
    }
    // Optimistic/local update
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    toast({
      title: "Transação atualizada!",
      description: "As informações foram salvas com sucesso.",
    });
  }, [isOnlineMode]);

  const deleteTransaction = useCallback(async (id: string) => {
    const user = await getCurrentUser();
    if (user && isOnlineMode) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao excluir na nuvem, aplicando local:', error);
      }
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação removida!",
      description: "A transação foi excluída com sucesso.",
      variant: "destructive",
    });
  }, [isOnlineMode]);

  const clearAllTransactions = useCallback(async () => {
    const user = await getCurrentUser();
    if (user && isOnlineMode) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao limpar na nuvem, limpando local:', error);
      }
    }
    setTransactions([]);
    toast({
      title: "Dados limpos!",
      description: "Todas as transações foram removidas.",
    });
  }, [isOnlineMode]);

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
