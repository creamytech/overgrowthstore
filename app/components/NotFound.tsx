import {Button} from './Button';
import {Icons} from '~/components/InlineIcons';

export function NotFound({type = 'page'}: {type?: string}) {
  const heading = `The trail ends here`;
  const description = `We couldn't find the ${type} you were looking for. Sometimes paths get overgrown. Let's find another way.`;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        {/* Decorative icon */}
        <div className="w-16 h-16 mx-auto mb-8 border border-rust/30 flex items-center justify-center">
          <Icons.Compass className="w-8 h-8 text-dark-green/40" />
        </div>
        
        <h1 className="font-heading text-4xl md:text-5xl text-dark-green tracking-widest mb-4 uppercase">
          {heading}
        </h1>
        
        <p className="font-body text-dark-green/70 text-lg mb-8">
          {description}
        </p>
        
        <Button width="auto" variant="secondary" to={'/'}>
          Find your way back
        </Button>
      </div>
    </div>
  );
}
