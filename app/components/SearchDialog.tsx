import {useState, useEffect, useRef, useCallback} from 'react';
import {useNavigate} from '@remix-run/react';
import {Search, X, Loader2} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {Input} from '~/components/ui/input';
import {Image} from '@shopify/hydrogen';

interface SearchResult {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
}

const popularSearches = [
  'T-Shirt',
  'Hoodie',
  'Cap',
  'Collection',
];

export function SearchDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Clear on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}&count=8`);
        if (response.ok) {
          const data = (await response.json()) as {products: SearchResult[]};
          setResults(data.products || []);
        }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  const handleProductClick = (handle: string) => {
    navigate(`/products/${handle}`);
    onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#0a0a0a] border-[#F2EFE9]/10 p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <form onSubmit={handleSearch} className="border-b border-[#F2EFE9]/10">
          <div className="flex items-center gap-4 p-4">
            <Search className="w-5 h-5 text-[#F2EFE9]/50" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search the archive..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-[#F2EFE9] placeholder:text-[#F2EFE9]/40 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {isLoading && <Loader2 className="w-4 h-4 text-[#B55A3C] animate-spin" />}
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#F2EFE9]/50 hover:text-[#F2EFE9]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Results / Popular Searches */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Popular Searches - Show when no query */}
          {!query && (
            <div className="p-4">
              <span className="font-mono text-[10px] text-[#F2EFE9]/50 uppercase tracking-[0.2em] block mb-3">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-xs uppercase tracking-wide hover:border-[#B55A3C] hover:text-[#B55A3C] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="p-4">
              <span className="font-mono text-[10px] text-[#F2EFE9]/50 uppercase tracking-[0.2em] block mb-3">
                {results.length} Result{results.length !== 1 ? 's' : ''}
              </span>
              <div className="space-y-3">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.handle)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-[#F2EFE9]/5 rounded-lg transition-colors text-left"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-20 bg-[#F2EFE9]/5 rounded overflow-hidden flex-shrink-0">
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-sm text-[#F2EFE9] uppercase tracking-wide truncate">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-[#B55A3C]">
                          ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                        </span>
                        {!product.availableForSale && (
                          <span className="font-mono text-[9px] text-[#F2EFE9]/50 uppercase">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[#F2EFE9]/30">→</span>
                  </button>
                ))}
              </div>

              {/* View All Results */}
              <button
                onClick={handleSearch}
                className="w-full mt-4 py-3 border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-xs uppercase tracking-[0.2em] hover:border-[#B55A3C] hover:text-[#B55A3C] transition-colors"
              >
                View All Results →
              </button>
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-mono text-sm text-[#F2EFE9]/50">
                No specimens found for "{query}"
              </p>
              <p className="font-mono text-xs text-[#F2EFE9]/30 mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Search trigger button for the header
export function SearchTrigger({onClick}: {onClick: () => void}) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-[#F2EFE9] hover:text-[#B55A3C] transition-colors"
      aria-label="Search products"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}
