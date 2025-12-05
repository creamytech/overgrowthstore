import {Link} from '~/components/Link';
import {Icons} from '~/components/InlineIcons';

export async function loader() {
  throw new Response('Not found', {status: 404});
}

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f4f1ea] via-[#ebe7dc] to-[#f4f1ea]" />
      
      {/* Decorative grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a472a 1px, transparent 1px),
            linear-gradient(to bottom, #1a472a 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 border border-dark-green/5 rotate-45 animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-rust/10 rotate-12 animate-float-slower" />
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border border-dark-green/5 -rotate-12 animate-float" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with layered effect */}
        <div className="relative mb-12">
          {/* Background number */}
          <div className="font-heading text-[10rem] md:text-[14rem] text-dark-green/[0.03] leading-none select-none absolute inset-0 flex items-center justify-center">
            404
          </div>
          {/* Foreground number */}
          <div className="font-heading text-[10rem] md:text-[14rem] text-dark-green/10 leading-none select-none relative">
            404
          </div>
          {/* Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-dark-green/20 flex items-center justify-center bg-[#f4f1ea]/80 backdrop-blur-sm">
              <Icons.Compass className="w-12 h-12 text-dark-green/40" />
            </div>
          </div>
        </div>
        
        {/* Message card */}
        <div className="bg-[#f9f7f3] border border-dark-green/15 p-10 md:p-14 relative shadow-lg">
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-dark-green/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-dark-green/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-dark-green/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-dark-green/20" />
          
          <h1 className="font-heading text-3xl md:text-4xl text-dark-green tracking-widest mb-6">
            PATH NOT FOUND
          </h1>
          
          <p className="font-body text-dark-green/60 text-lg mb-3 max-w-md mx-auto">
            This trail hasn't been discovered yet.
          </p>
          <p className="font-body text-dark-green/40 text-sm">
            The page you're looking for may have been moved, or it never existed in the first place.
          </p>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-10">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-dark-green/20" />
            <div className="w-2 h-2 border border-rust rotate-45" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-dark-green/20" />
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="group inline-flex items-center justify-center gap-3 bg-dark-green text-[#f4f1ea] px-8 py-4 font-heading tracking-widest hover:bg-rust transition-all duration-300"
            >
              <Icons.House className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link 
              to="/collections" 
              className="group inline-flex items-center justify-center gap-3 border border-dark-green/30 text-dark-green px-8 py-4 font-heading tracking-widest hover:border-rust hover:text-rust transition-all duration-300"
            >
              <span>Browse Collections</span>
              <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Footer quote */}
        <div className="mt-12">
          <p className="font-body text-xs text-dark-green/30 italic">
            "Not all who wander are lost — but perhaps this page is."
          </p>
        </div>
      </div>
    </div>
  );
}
