import {Badge} from '~/components/ui/badge';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {AlertTriangle, Flame, Clock} from 'lucide-react';

interface InventoryDisplayProps {
  quantityAvailable?: number | null;
  availableForSale: boolean;
  showExactCount?: boolean;
  className?: string;
}

export function InventoryDisplay({
  quantityAvailable,
  availableForSale,
  showExactCount = false,
  className = '',
}: InventoryDisplayProps) {
  // If sold out
  if (!availableForSale) {
    return (
      <Badge 
        variant="outline" 
        className={`font-mono text-[10px] uppercase tracking-wider border-[#8A8A84]/30 text-[#8A8A84] ${className}`}
      >
        Archived
      </Badge>
    );
  }

  // If no inventory tracking or unknown
  if (quantityAvailable === null || quantityAvailable === undefined) {
    return (
      <Badge 
        variant="outline" 
        className={`font-mono text-[10px] uppercase tracking-wider border-[#1a472a]/30 text-[#1a472a] ${className}`}
      >
        Available
      </Badge>
    );
  }

  // Critical low stock (1-3 items)
  if (quantityAvailable <= 3) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge 
          className="font-mono text-[10px] uppercase tracking-wider bg-[#B55A3C] text-[#F2EFE9] animate-pulse"
        >
          <Flame className="w-3 h-3 mr-1" />
          Only {quantityAvailable} left
        </Badge>
      </div>
    );
  }

  // Low stock (4-10 items)
  if (quantityAvailable <= 10) {
    return (
      <Badge 
        variant="outline"
        className={`font-mono text-[10px] uppercase tracking-wider border-[#B55A3C]/50 text-[#B55A3C] ${className}`}
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        {showExactCount ? `${quantityAvailable} remaining` : 'Low stock'}
      </Badge>
    );
  }

  // In stock
  return (
    <Badge 
      variant="outline" 
      className={`font-mono text-[10px] uppercase tracking-wider border-[#1a472a]/30 text-[#1a472a] ${className}`}
    >
      In Stock
    </Badge>
  );
}

// Larger urgency alert for product pages
export function InventoryAlert({
  quantityAvailable,
  availableForSale,
}: {
  quantityAvailable?: number | null;
  availableForSale: boolean;
}) {
  if (!availableForSale) {
    return (
      <Alert className="bg-[#8A8A84]/10 border-[#8A8A84]/30">
        <Clock className="h-4 w-4 text-[#8A8A84]" />
        <AlertDescription className="font-mono text-xs text-[#8A8A84]">
          This specimen has been archived. No longer available.
        </AlertDescription>
      </Alert>
    );
  }

  if (quantityAvailable !== null && quantityAvailable !== undefined && quantityAvailable <= 5) {
    return (
      <Alert className="bg-[#B55A3C]/10 border-[#B55A3C]/30">
        <AlertTriangle className="h-4 w-4 text-[#B55A3C]" />
        <AlertDescription className="font-mono text-xs text-[#B55A3C]">
          ⚠ Only {quantityAvailable} remaining | No restocks once sold out
        </AlertDescription>
      </Alert>
    );
  }

  if (availableForSale) {
    return (
      <Alert className="bg-[#B55A3C]/10 border-[#B55A3C]/30">
        <AlertDescription className="font-mono text-xs text-[#B55A3C]">
          ⚠ Limited stock | No restocks once sold out
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
