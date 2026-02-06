import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

interface LedgerEntry {
  type: 'earn' | 'spend' | 'adjust';
  amount: number;
  reason: string;
  created_at: string;
  user_id: string;
}

interface WalletContextType {
  balance: number;
  isLoading: boolean;
  ledger: LedgerEntry[];
  ledgerLoading: boolean;
  fetchBalance: () => Promise<void>;
  fetchLedger: () => Promise<void>;
  spendCoins: (amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  topUpCoins: (amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function getAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || publicAnonKey;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance ?? 0);
      } else {
        console.error('Wallet balance error:', data.error);
      }
    } catch (err) {
      console.error('Wallet fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLedger = useCallback(async () => {
    setLedgerLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}/wallet/ledger`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setLedger(data.entries || []);
      } else {
        console.error('Wallet ledger error:', data.error);
      }
    } catch (err) {
      console.error('Ledger fetch failed:', err);
    } finally {
      setLedgerLoading(false);
    }
  }, []);

  const spendCoins = useCallback(async (amount: number, reason: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}/wallet/spend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل في خصم الكوينز' };
    } catch (err: any) {
      console.error('Spend coins error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const topUpCoins = useCallback(async (amount: number, reason: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}/wallet/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason, type: 'earn' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.balance);
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل في شحن الكوينز' };
    } catch (err: any) {
      console.error('TopUp coins error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch balance on mount + when auth changes
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchBalance();
      } else {
        setIsLoading(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchBalance();
      } else {
        setBalance(0);
        setLedger([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchBalance]);

  return (
    <WalletContext.Provider value={{
      balance,
      isLoading,
      ledger,
      ledgerLoading,
      fetchBalance,
      fetchLedger,
      spendCoins,
      topUpCoins,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
