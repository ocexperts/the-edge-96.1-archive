import { useEffect, useState, useCallback } from "react";
import { me, logout as logoutFn } from "@/lib/auth.functions";

export type AuthUser = { id: string; email: string; isAdmin: boolean };

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await me();
      setUser(r.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await logoutFn();
    setUser(null);
  }, []);

  return {
    user,
    isAdmin: !!user?.isAdmin,
    loading,
    refresh,
    signOut,
  };
}
