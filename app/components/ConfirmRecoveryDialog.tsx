import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import {Button} from '~/components/ui/button';
import {Progress} from '~/components/ui/progress';
import {useState, useEffect} from 'react';

interface ConfirmRecoveryDialogProps {
  checkoutUrl: string;
  itemCount: number;
  hasLimitedItems?: boolean;
}

export function ConfirmRecoveryDialog({
  checkoutUrl,
  itemCount,
  hasLimitedItems = false,
}: ConfirmRecoveryDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isProcessing]);

  const handleConfirm = () => {
    setIsProcessing(true);
    // Small delay for visual feedback before redirect
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 800);
  };

  if (!hasLimitedItems) {
    // Direct checkout without confirmation for non-limited items
    return (
      <a href={checkoutUrl} target="_self">
        <Button className="w-full py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300">
          Complete Recovery
        </Button>
      </a>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300">
          Complete Recovery
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#F2EFE9] border-[#1a472a]/20 max-w-md">
        {isProcessing ? (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-2">
                Processing
              </span>
              <h3 className="font-heading text-2xl text-[#1a472a] uppercase tracking-[0.1em]">
                Securing Artifacts...
              </h3>
            </div>
            <Progress value={progress} className="h-1 bg-[#1a472a]/10" />
            <p className="font-mono text-[10px] text-[#8A8A84] text-center tracking-wide">
              Do not close this window
            </p>
          </div>
        ) : (
          <>
            <AlertDialogHeader className="text-center">
              <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-2">
                — Confirm —
              </span>
              <AlertDialogTitle className="font-heading text-2xl text-[#1a472a] uppercase tracking-[0.1em]">
                Confirm Recovery?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-mono text-sm text-[#8A8A84] mt-4">
                You are about to recover {itemCount} limited artifact{itemCount > 1 ? 's' : ''}.
                <br />
                <span className="text-[#B55A3C]">These items are in high demand and may sell out.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex-col gap-3 sm:flex-col">
              <AlertDialogAction
                onClick={handleConfirm}
                className="w-full py-4 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em]"
              >
                Yes, Secure My Artifacts
              </AlertDialogAction>
              <AlertDialogCancel className="w-full py-4 border border-[#1a472a]/20 text-[#1a472a] hover:bg-[#1a472a]/5 font-mono text-xs uppercase tracking-[0.2em]">
                Continue Browsing
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
