import { CartForm, Image, Money } from '@shopify/hydrogen';
import { Link } from 'react-router';

export function CartLineItem({ line, layout }) {
  const { merchandise, quantity } = line;

  return (
    <li className="flex py-6 px-4 sm:px-6">
      {/* Product image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        {merchandise.image && (
          <Image
            data={merchandise.image}
            className="h-full w-full object-cover object-center"
            width={96}
            height={96}
          />
        )}
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/products/${merchandise.product.handle}`}>
                {merchandise.product.title}
              </Link>
            </h3>
            <div className="ml-4">
              <Money data={line.cost.totalAmount} />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">{merchandise.title}</p>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          {/* Quantity selector */}
          <div className="text-gray-500">
            <label htmlFor={`quantity-${line.id}`} className="sr-only">
              Quantity, {quantity}
            </label>
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesUpdate}
              inputs={{ lines: [{ id: line.id, quantity: quantity }] }}
            >
              <select
                id={`quantity-${line.id}`}
                name="quantity"
                value={quantity}
                onChange={(e) => {
                  const form = e.target.closest('form');
                  const input = form?.querySelector('input[name="quantity"]');
                  if (input) input.value = e.target.value;
                  form?.requestSubmit();
                }}
                className="rounded-md border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    Qty {num}
                  </option>
                ))}
              </select>
              <input type="hidden" name="quantity" value={quantity} />
            </CartForm>
          </div>

          {/* Remove button */}
          <div className="flex">
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesRemove}
              inputs={{ lineIds: [line.id] }}
            >
              <button
                type="submit"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Remove
              </button>
            </CartForm>
          </div>
        </div>
      </div>
    </li>
  );
}
