import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({lenis: null});

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({children}: {children: ReactNode}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      reqIdRef.current = requestAnimationFrame(raf);
    }

    reqIdRef.current = requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{lenis}}>
      {children}
    </LenisContext.Provider>
  );
}
