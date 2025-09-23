import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// IMPORTANT: Using provided anon key and inferred URL from project ref
// Ref: yemeadnjxukajrkgigrp -> https://yemeadnjxukajrkgigrp.supabase.co
const SUPABASE_URL = 'https://yemeadnjxukajrkgigrp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbWVhZG5qeHVrYWpya2dpZ3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Mzc5NDEsImV4cCI6MjA3NDIxMzk0MX0.WI2XfB5g1-mpoWjFl3B-4CWORBJ5kawNMdo-TZIKT5g';

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabase;
}

export async function getCurrentUser() {
  const client = getSupabase();
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

// Data mappings between app Transaction and DB row
export type DbTransactionRow = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // timestamptz -> ISO string
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
};

export type AppTransaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO
  isRecurring?: boolean;
};

export function mapDbToApp(row: DbTransactionRow): AppTransaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    type: row.type,
    category: row.category,
    date: row.date,
    isRecurring: row.is_recurring,
  };
}

export function mapAppToDb(input: Omit<AppTransaction, 'id'> & { id?: string; user_id: string }): Partial<DbTransactionRow> {
  return {
    id: input.id,
    user_id: input.user_id,
    description: input.description,
    amount: input.amount,
    type: input.type,
    category: input.category,
    date: input.date, // ISO -> timestamptz
    is_recurring: Boolean(input.isRecurring),
  } as Partial<DbTransactionRow>;
}
