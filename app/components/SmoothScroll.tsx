import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {useLocation} from '@remix-run/react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({lenis: null});

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({children}: {children: ReactNode}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const location = useLocation();

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

  // Scroll to top on route change
  useEffect(() => {
    if (lenis) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, {immediate: true});
    }
  }, [location.pathname, lenis]);

  return (
    <LenisContext.Provider value={{lenis}}>
      {children}
    </LenisContext.Provider>
  );
}
