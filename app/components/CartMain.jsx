import { CartForm } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAside } from './Aside';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';

export function CartMain({ layout, cart }) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const { close } = useAside();

  return (
    <div className="flex h-full flex-col">
      {/* Empty state */}
      {!linesCount && (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <ShoppingBagIcon className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Add some products to get started.</p>
          <Link
            to="/collections"
            onClick={close}
            className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {/* Cart items */}
      {linesCount && (
        <>
          <div className="flex-1 overflow-y-auto">
            <ul role="list" className="divide-y divide-gray-200">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>

          {/* Cart summary - sticky at bottom */}
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <CartSummary cart={cart} layout={layout} />
          </div>
        </>
      )}
    </div>
  );
}
