import {useEffect, useState, useCallback} from 'react';
import {useNavigate} from '@remix-run/react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '~/components/ui/command';

interface CommandPaletteProps {
  products?: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
  collections?: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
}

export function CommandPalette({products = [], collections = []}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Static navigation items
  const navItems = [
    {title: 'Home', path: '/'},
    {title: 'All Artifacts', path: '/products'},
    {title: 'Our Story', path: '/pages/our-story'},
    {title: 'Contact', path: '/pages/contact'},
    {title: 'FAQ', path: '/pages/faq'},
    {title: 'Cart', path: '/cart'},
    {title: 'Account', path: '/account'},
  ];

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-[#F2EFE9] border-[#1a472a]/20">
          <CommandInput 
            placeholder="Search the archive..." 
            className="font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84]"
          />
          <CommandList className="bg-[#F2EFE9]">
            <CommandEmpty className="font-mono text-sm text-[#8A8A84] py-6 text-center">
              No artifacts found.
            </CommandEmpty>

            {/* Navigation */}
            <CommandGroup heading="Navigate">
              {navItems.map((item) => (
                <CommandItem
                  key={item.path}
                  value={item.title}
                  onSelect={() => runCommand(() => navigate(item.path))}
                  className="font-mono text-sm text-[#1a472a] cursor-pointer hover:bg-[#1a472a]/5"
                >
                  <span className="text-[#B55A3C] mr-2">→</span>
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Collections */}
            {collections.length > 0 && (
              <>
                <CommandSeparator className="bg-[#1a472a]/10" />
                <CommandGroup heading="Collections">
                  {collections.map((collection) => (
                    <CommandItem
                      key={collection.id}
                      value={collection.title}
                      onSelect={() => runCommand(() => navigate(`/collections/${collection.handle}`))}
                      className="font-mono text-sm text-[#1a472a] cursor-pointer hover:bg-[#1a472a]/5"
                    >
                      <span className="text-[#3E5F4B] mr-2">◆</span>
                      {collection.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Products */}
            {products.length > 0 && (
              <>
                <CommandSeparator className="bg-[#1a472a]/10" />
                <CommandGroup heading="Artifacts">
                  {products.slice(0, 8).map((product, i) => (
                    <CommandItem
                      key={product.id}
                      value={product.title}
                      onSelect={() => runCommand(() => navigate(`/products/${product.handle}`))}
                      className="font-mono text-sm text-[#1a472a] cursor-pointer hover:bg-[#1a472a]/5"
                    >
                      <span className="text-[#8A8A84] mr-2 font-mono text-[10px]">
                        №{(i + 1).toString().padStart(3, '0')}
                      </span>
                      {product.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Actions */}
            <CommandSeparator className="bg-[#1a472a]/10" />
            <CommandGroup heading="Actions">
              <CommandItem
                value="search"
                onSelect={() => runCommand(() => navigate('/search'))}
                className="font-mono text-sm text-[#1a472a] cursor-pointer hover:bg-[#1a472a]/5"
              >
                <span className="text-[#B55A3C] mr-2">⌕</span>
                Full Search
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
