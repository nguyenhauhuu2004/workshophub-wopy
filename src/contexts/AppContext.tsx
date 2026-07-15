import React, { createContext, useContext, useState, useCallback } from "react";
import type { User, Booking } from "../data";
import { MOCK_BOOKINGS } from "../data";

interface AppContextValue {
  user: User | null;
  login: (email: string, name: string, isHost?: boolean) => void;
  logout: () => void;
  saveWorkshop: (id: number) => void;
  addBooking: (booking: Booking) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const MOCK_USER: User = {
  id: "u1",
  name: "Alex Rivera",
  email: "alex@example.com",
  avatar: "from-violet-500 to-purple-600",
  isHost: false,
  bookings: MOCK_BOOKINGS,
  savedWorkshops: [2, 4, 7],
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, name: string, isHost = false) => {
    setUser({ ...MOCK_USER, email, name, isHost });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const saveWorkshop = useCallback((id: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const saved = prev.savedWorkshops.includes(id)
        ? prev.savedWorkshops.filter((s) => s !== id)
        : [...prev.savedWorkshops, id];
      return { ...prev, savedWorkshops: saved };
    });
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, bookings: [booking, ...prev.bookings] };
    });
  }, []);

  return (
    <AppContext.Provider value={{ user, login, logout, saveWorkshop, addBooking }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
