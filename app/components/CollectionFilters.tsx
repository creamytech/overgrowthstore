import {useState} from 'react';
import {Button} from '~/components/ui/button';
import {Badge} from '~/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {Checkbox} from '~/components/ui/checkbox';
import {Label} from '~/components/ui/label';
import {SlidersHorizontal, X} from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FiltersState {
  sizes: string[];
  availability: 'all' | 'available' | 'archived';
  priceRange: [number, number];
  sortBy: string;
}

interface CollectionFiltersProps {
  availableSizes?: FilterOption[];
  maxPrice?: number;
  onFiltersChange: (filters: FiltersState) => void;
  activeFiltersCount?: number;
}

const defaultSizes: FilterOption[] = [
  {value: 'XS', label: 'XS'},
  {value: 'S', label: 'S'},
  {value: 'M', label: 'M'},
  {value: 'L', label: 'L'},
  {value: 'XL', label: 'XL'},
  {value: 'XXL', label: 'XXL'},
];

const sortOptions = [
  {value: 'featured', label: 'Featured'},
  {value: 'newest', label: 'Newest'},
  {value: 'price-asc', label: 'Price: Low to High'},
  {value: 'price-desc', label: 'Price: High to Low'},
  {value: 'title-asc', label: 'A-Z'},
];

export function CollectionFilters({
  availableSizes = defaultSizes,
  maxPrice = 500,
  onFiltersChange,
  activeFiltersCount = 0,
}: CollectionFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    sizes: [],
    availability: 'all',
    priceRange: [0, maxPrice],
    sortBy: 'featured',
  });

  const updateFilters = (partial: Partial<FiltersState>) => {
    const newFilters = {...filters, ...partial};
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FiltersState = {
      sizes: [],
      availability: 'all',
      priceRange: [0, maxPrice],
      sortBy: 'featured',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    updateFilters({sizes: newSizes});
  };

  return (
    <div className="flex items-center gap-4">
      {/* Mobile Filter Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="lg:hidden border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C]"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-[#B55A3C] text-[#F2EFE9]">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-[#F2EFE9] border-[#1a472a]/10">
          <SheetHeader>
            <SheetTitle className="font-heading text-lg text-[#1a472a] uppercase tracking-wide">
              Filter & Sort
            </SheetTitle>
          </SheetHeader>
          <FilterContent
            filters={filters}
            availableSizes={availableSizes}
            maxPrice={maxPrice}
            toggleSize={toggleSize}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Size Filter Dropdown could go here */}
        
        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({sortBy: e.target.value})}
          className="bg-transparent border border-[#1a472a]/20 text-[#1a472a] font-mono text-xs uppercase tracking-wide px-4 py-2 focus:outline-none focus:border-[#B55A3C]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Availability Toggle */}
        <div className="flex border border-[#1a472a]/20 divide-x divide-[#1a472a]/20">
          {['all', 'available', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => updateFilters({availability: status as FiltersState['availability']})}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                filters.availability === status
                  ? 'bg-[#1a472a] text-[#F2EFE9]'
                  : 'text-[#1a472a] hover:bg-[#1a472a]/10'
              }`}
            >
              {status === 'all' ? 'All' : status === 'available' ? 'Available' : 'Archived'}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#B55A3C] hover:text-[#9A4A30] font-mono text-xs uppercase"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

function FilterContent({
  filters,
  availableSizes,
  maxPrice,
  toggleSize,
  updateFilters,
  clearFilters,
}: {
  filters: FiltersState;
  availableSizes: FilterOption[];
  maxPrice: number;
  toggleSize: (size: string) => void;
  updateFilters: (partial: Partial<FiltersState>) => void;
  clearFilters: () => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <Accordion type="multiple" defaultValue={['size', 'availability']} className="w-full">
        {/* Size Filter */}
        <AccordionItem value="size" className="border-[#1a472a]/10">
          <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C]">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => toggleSize(size.value)}
                  className={`px-3 py-2 border font-mono text-xs uppercase transition-colors ${
                    filters.sizes.includes(size.value)
                      ? 'border-[#B55A3C] bg-[#B55A3C] text-[#F2EFE9]'
                      : 'border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C]'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability Filter */}
        <AccordionItem value="availability" className="border-[#1a472a]/10">
          <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C]">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {[
                {value: 'all', label: 'All Items'},
                {value: 'available', label: 'Available Only'},
                {value: 'archived', label: 'Archived Only'},
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filters.availability === option.value}
                    onCheckedChange={() => updateFilters({availability: option.value as FiltersState['availability']})}
                    className="border-[#1a472a]/30 data-[state=checked]:bg-[#B55A3C] data-[state=checked]:border-[#B55A3C]"
                  />
                  <Label
                    htmlFor={option.value}
                    className="font-mono text-xs text-[#1a472a] uppercase tracking-wide cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort */}
        <AccordionItem value="sort" className="border-[#1a472a]/10">
          <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C]">
            Sort By
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({sortBy: option.value})}
                  className={`w-full text-left px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-[#B55A3C]/10 text-[#B55A3C]'
                      : 'text-[#1a472a] hover:bg-[#1a472a]/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear All */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C] font-mono text-xs uppercase tracking-wider"
      >
        Clear All Filters
      </Button>
    </div>
  );
}
