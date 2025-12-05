import {IconClose} from '~/components/Icon';
import {Link} from '~/components/Link';

export function Modal({
  children,
  cancelLink,
  close,
}: {
  children: React.ReactNode;
  cancelLink?: string;
  close?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-green/60 backdrop-blur-sm transition-opacity"
        onClick={close}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-lg transform overflow-hidden bg-[#f4f1ea] shadow-2xl transition-all"
            role="button"
            onClick={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            tabIndex={0}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

