import { CartForm, Money } from '@shopify/hydrogen';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAside } from './Aside';

export function CartSummary({ cart, layout }) {
  const { close } = useAside();

  return (
    <div className="space-y-4">
      {/* Discount codes */}
      {cart?.discountCodes?.length > 0 && (
        <div className="space-y-2">
          {cart.discountCodes.map((discount) => (
            <div key={discount.code} className="flex items-center justify-between text-sm text-green-600">
              <span className="flex items-center gap-2">
                <span className="font-medium">{discount.code}</span>
              </span>
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.DiscountCodesUpdate}
                inputs={{ discountCodes: [] }}
              >
                <button
                  type="submit"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span className="sr-only">Remove discount {discount.code}</span>
                </button>
              </CartForm>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal */}
      <div className="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <Money data={cart.cost.subtotalAmount} />
      </div>

      <p className="text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>

      {/* Checkout button - redirects to Shopify Checkout */}
      <div className="mt-6">
        <a
          href={cart.checkoutUrl}
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Checkout
        </a>
      </div>

      {/* Continue shopping */}
      {layout === 'aside' && (
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <button
            type="button"
            onClick={close}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Continue Shopping
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
