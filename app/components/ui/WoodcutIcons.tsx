export function IconWoodSign({className}: {className?: string}) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Ropes */}
      <path d="M7 2v4" />
      <path d="M17 2v4" />
      
      {/* Wood Sign Body */}
      <path d="M3 6h18v10H3z" className="boiling-border fill-paper/10" />
      
      {/* Wood Grain Details */}
      <path d="M5 9h4" className="opacity-50" />
      <path d="M15 13h4" className="opacity-50" />
      <path d="M8 13h2" className="opacity-50" />
      
      {/* Text Placeholder (Menu) */}
      <path d="M7 11l2-2 2 2" className="opacity-80" />
      <path d="M13 11l2-2 2 2" className="opacity-80" />
    </svg>
  );
}

export function IconRucksack({className}: {className?: string}) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Bag Body - Rounded Bottom */}
      <path d="M5 8v10a3 3 0 003 3h8a3 3 0 003-3V8" className="boiling-border fill-paper/10" />
      
      {/* Flap - Overhanging */}
      <path d="M4 8h16l-1-4H5L4 8z" className="boiling-border fill-paper/20" />
      
      {/* Pockets */}
      <rect x="6" y="12" width="4" height="5" rx="1" className="boiling-border" />
      <rect x="14" y="12" width="4" height="5" rx="1" className="boiling-border" />
      
      {/* Straps/Buckles */}
      <path d="M8 8v4" />
      <path d="M16 8v4" />
    </svg>
  );
}
