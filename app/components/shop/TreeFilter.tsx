import {Link} from '@remix-run/react';
import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

type CollectionNode = {
  id: string;
  title: string;
  handle: string;
  children?: CollectionNode[];
};

// Mock data for now, ideally passed from loader
const MOCK_TREE: CollectionNode[] = [
  {
    id: '1',
    title: 'Flora',
    handle: 'flora',
    children: [
        {id: '1-1', title: 'Succulents', handle: 'succulents'},
        {id: '1-2', title: 'Ferns', handle: 'ferns'},
    ]
  },
  {
    id: '2',
    title: 'Fauna',
    handle: 'fauna',
    children: [
        {id: '2-1', title: 'Insects', handle: 'insects'},
        {id: '2-2', title: 'Bones', handle: 'bones'},
    ]
  },
  {id: '3', title: 'Tools', handle: 'tools'},
];

function TreeNode({node, depth = 0}: {node: CollectionNode; depth?: number}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      {/* Connector Line (Vertical) - Hand-drawn feel */}
      {depth > 0 && (
        <div className="absolute left-[-12px] top-0 bottom-0 w-px bg-moss/40 border-l border-dashed border-moss/60" />
      )}
      
      <div className="flex items-center py-2 group">
         {/* Connector Line (Horizontal) */}
         {depth > 0 && (
            <div className="absolute left-[-12px] top-1/2 w-3 h-px bg-moss/40" />
         )}

        <div className="flex items-center gap-2">
            {hasChildren && (
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-5 h-5 flex items-center justify-center border-2 border-moss rounded-full text-[10px] text-moss hover:bg-moss hover:text-paper transition-all duration-300"
                style={{borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'}} // Organic shape
            >
                {isOpen ? '-' : '+'}
            </button>
            )}
            {!hasChildren && <div className="w-5" />} {/* Spacer */}
            
            <Link 
                to={`/collections/${node.handle}`}
                className="font-serif text-lg text-ink hover:text-rust transition-colors decoration-rust hover:underline underline-offset-4"
            >
                {node.title}
            </Link>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="ml-5 pl-2 border-l-2 border-dotted border-moss/30 overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TreeFilter() {
  return (
    <div className="p-6 border-r-2 border-ink/10 min-h-[50vh]">
      <h3 className="font-mono text-sm text-moss mb-4 uppercase tracking-widest border-b border-moss/20 pb-2">
        Taxonomy
      </h3>
      <div className="space-y-1">
        {MOCK_TREE.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
