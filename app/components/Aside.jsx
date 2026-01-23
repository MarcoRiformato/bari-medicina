import { createContext, useContext, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AsideContext = createContext(null);

export function useAside() {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}

export function Aside({ children, heading, id }) {
  const { type, close } = useAside();
  const expanded = type === id;

  return (
    <Dialog open={expanded} onClose={close} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-200 ease-out data-closed:translate-x-full"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between px-4 py-6 sm:px-6">
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    {heading}
                  </DialogTitle>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      onClick={close}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
                  {children}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export function AsideProvider({ children }) {
  const [type, setType] = useState('closed');

  const open = (newType) => setType(newType);
  const close = () => setType('closed');

  return (
    <AsideContext.Provider value={{ type, open, close }}>
      {children}
    </AsideContext.Provider>
  );
}

Aside.Provider = AsideProvider;
