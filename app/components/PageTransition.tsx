import {useNavigation} from '@remix-run/react';
import {useEffect, useState} from 'react';

// Simplified PageTransition - just renders children directly
export function PageTransition({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}

// Navigation progress bar component
export function NavigationProgress() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const isNavigating = navigation.state !== 'idle';

  useEffect(() => {
    if (isNavigating) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-muted">
      <div
        className="h-full bg-secondary transition-all duration-100"
        style={{width: `${progress}%`}}
      />
    </div>
  );
}
