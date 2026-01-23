import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {HeartIcon} from '@heroicons/react/24/outline';
import {HeartIcon as HeartIconSolid} from '@heroicons/react/24/solid';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistAnimation, setWishlistAnimation] = useState(false);

  const handleWishlistClick = () => {
    setWishlistAnimation(true);
    setIsWishlisted(!isWishlisted);
    setTimeout(() => setWishlistAnimation(false), 300);
  };

  // Check if an option is a color option (for special color swatch rendering)
  const isColorOption = (optionName) => {
    const colorNames = ['color', 'colour', 'colore'];
    return colorNames.includes(optionName.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        const isColor = isColorOption(option.name);

        return (
          <div key={option.name}>
            <h3 className="text-sm text-gray-600">{option.name}</h3>
            <fieldset aria-label={`Scegli ${option.name}`} className="mt-2">
              <div className={isColor ? 'flex items-center gap-x-3' : 'flex flex-wrap gap-2'}>
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  // Color swatch styling
                  if (isColor && swatch?.color) {
                    const colorClassName = `size-8 rounded-full border-2 transition-all ${
                      selected
                        ? 'border-sky-600 ring-2 ring-sky-600 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${!available ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`;

                    if (isDifferentProduct) {
                      return (
                        <Link
                          key={option.name + name}
                          className={colorClassName}
                          style={{backgroundColor: swatch.color}}
                          prefetch="intent"
                          preventScrollReset
                          replace
                          to={`/products/${handle}?${variantUriQuery}`}
                          aria-label={name}
                        />
                      );
                    }
                    return (
                      <button
                        type="button"
                        key={option.name + name}
                        className={colorClassName}
                        style={{backgroundColor: swatch.color}}
                        disabled={!exists}
                        aria-label={name}
                        onClick={() => {
                          if (!selected) {
                            void navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                      />
                    );
                  }

                  // Regular option styling
                  const className = `relative flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-sky-600 bg-sky-50 text-sky-600'
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  } ${!available ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`;

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className={className}
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    );
                  }
                  return (
                    <button
                      type="button"
                      className={className}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        );
      })}
      <div className="mt-10 flex">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Aggiungi al carrello' : 'Esaurito'}
        </AddToCartButton>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`ml-4 flex items-center justify-center rounded-md px-3 py-3 transition-all ${
            isWishlisted
              ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'
          } ${wishlistAnimation ? 'scale-125' : 'scale-100'}`}
        >
          {isWishlisted ? (
            <HeartIconSolid aria-hidden="true" className="size-6 shrink-0" />
          ) : (
            <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
          )}
          <span className="sr-only">
            {isWishlisted ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <div
      aria-label={name}
      className="flex items-center justify-center"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="sr-only">{name}</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
