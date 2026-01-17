import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

// Simplified - disabled Lenis for now to fix performance issues
// Can re-enable once the shadcn redesign is stable

interface LenisContextType {
  lenis: null;
}

const LenisContext = createContext<LenisContextType>({lenis: null});

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({children}: {children: ReactNode}) {
  const contextValue = useMemo(() => ({lenis: null}), []);

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
