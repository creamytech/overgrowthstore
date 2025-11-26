import {motion} from 'framer-motion';
import {Link} from '@remix-run/react';

type MenuItem = {
  id: string;
  title: string;
  to: string;
};

export function RoadSignMenu({menuItems}: {menuItems: MenuItem[]}) {
  return (
    <nav className="flex flex-wrap justify-center gap-6 md:gap-12 py-4">
      {menuItems.map((item, index) => (
        <RoadSignLink key={item.id} item={item} index={index} />
      ))}
    </nav>
  );
}

function RoadSignLink({item, index}: {item: MenuItem; index: number}) {
  // Random slight rotation for organic feel
  const randomRotate = (index % 3) - 1; 

  return (
    <motion.div
      initial={{rotate: randomRotate}}
      whileHover={{
        rotate: [randomRotate, randomRotate + 2, randomRotate - 2, randomRotate],
        transition: {duration: 0.4, ease: "easeInOut"}
      }}
      className="relative group"
    >
      {/* The "Wire" holding the sign */}
      <div className="absolute -top-4 left-1/2 w-px h-4 bg-ink/40 -translate-x-1/2" />
      
      {/* The Sign Itself */}
      <Link
        to={item.to}
        className="block relative bg-moss text-paper border-2 border-ink px-6 py-2 min-w-[120px] text-center font-serif uppercase tracking-widest text-sm shadow-[2px_2px_0px_0px_rgba(28,28,28,1)] hover:bg-rust transition-colors duration-300"
      >
        {/* Bolt Holes */}
        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-ink/30" />
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-ink/30" />
        <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-ink/30" />
        <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-ink/30" />
        
        {item.title}
      </Link>
    </motion.div>
  );
}
