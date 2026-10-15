import { createContext, useContext, type ReactNode } from 'react';
import { getBootstrap } from '../lib/api';
import type { Bootstrap } from '../lib/types';
import { useRemote, type Remote } from './useRemote';

// Settings, announcements, clubs and categories: loaded once at startup and
// shared by every screen.

const BootstrapContext = createContext<Remote<Bootstrap> | null>(null);

export function BootstrapProvider({ children }: { children: ReactNode }) {
  const remote = useRemote(getBootstrap, []);
  return <BootstrapContext.Provider value={remote}>{children}</BootstrapContext.Provider>;
}

export function useBootstrap() {
  const ctx = useContext(BootstrapContext);
  if (!ctx) throw new Error('useBootstrap must be used inside BootstrapProvider');
  return ctx;
}
