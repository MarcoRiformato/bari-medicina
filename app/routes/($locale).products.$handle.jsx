import { useLoaderData } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
} from '@shopify/hydrogen';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  MinusIcon,
  PlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductForm } from '~/components/ProductForm';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({ context, params }) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const { product } = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  // Get all product images
  const images = product.images?.nodes || [];
  // If no product images, fallback to variant image
  const displayImages =
    images.length > 0
      ? images
      : selectedVariant?.image
        ? [selectedVariant.image]
        : [];

  // Product details for accordions
  const productDetails = [
    {
      name: 'Caratteristiche',
      content: descriptionHtml,
      type: 'html',
    },
    {
      name: 'Spedizione',
      items: [
        'Spedizione gratuita per ordini superiori a €50',
        'Spedizione internazionale disponibile',
        'Consegna in 2-5 giorni lavorativi',
      ],
      type: 'list',
    },
    {
      name: 'Resi',
      items: [
        'Reso facile entro 30 giorni',
        'Etichetta di reso prepagata inclusa',
        'Rimborso completo o sostituzione',
      ],
      type: 'list',
    },
  ];

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
            {/* Image gallery */}
            <div className="flex flex-col lg:sticky lg:top-8">
              <TabGroup className="flex flex-col-reverse">
                {/* Image selector */}
                {displayImages.length > 1 && (
                  <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                    <TabList className="grid grid-cols-4 gap-6">
                      {displayImages.map((image, index) => (
                        <Tab
                          key={image.id || index}
                          className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-sky-500/50 focus:ring-offset-4 focus:outline-hidden"
                        >
                          <span className="sr-only">{image.altText || `Immagine ${index + 1}`}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              alt={image.altText || ''}
                              data={image}
                              className="size-full object-cover"
                              sizes="96px"
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-sky-500"
                          />
                        </Tab>
                      ))}
                    </TabList>
                  </div>
                )}

                <TabPanels>
                  {displayImages.map((image, index) => (
                    <TabPanel key={image.id || index}>
                      <Image
                        alt={image.altText || 'Product Image'}
                        data={image}
                        className="aspect-square w-full object-cover sm:rounded-lg"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </TabPanel>
                  ))}
                  {displayImages.length === 0 && (
                    <TabPanel>
                      <div className="aspect-square w-full bg-gray-200 sm:rounded-lg" />
                    </TabPanel>
                  )}
                </TabPanels>
              </TabGroup>

              {/* Trust badges - inline (Moved from right column) */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <TruckIcon className="size-5 text-green-600" />
                  <span>Spedizione gratuita</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="size-5 text-green-600" />
                  <span>Pagamento sicuro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ArrowPathIcon className="size-5 text-green-600" />
                  <span>Reso facile</span>
                </div>
              </div>

              {/* Trust section with icons (Moved from right column) */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-full bg-sky-100 p-2">
                    <TruckIcon className="size-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Spedizione veloce</p>
                    <p className="text-xs text-gray-500">Consegna in 2-4 giorni</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-full bg-sky-100 p-2">
                    <ArrowPathIcon className="size-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reso gratuito</p>
                    <p className="text-xs text-gray-500">Entro 30 giorni</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-full bg-sky-100 p-2">
                    <ShieldCheckIcon className="size-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Garanzia qualità</p>
                    <p className="text-xs text-gray-500">Prodotti certificati</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-full bg-sky-100 p-2">
                    <CheckBadgeIcon className="size-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Assistenza dedicata</p>
                    <p className="text-xs text-gray-500">Supporto via chat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* Vendor badge */}
              {product.vendor && (
                <p className="text-sm font-medium text-sky-600 uppercase tracking-wide">
                  {product.vendor}
                </p>
              )}

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>

              <div className="mt-4">
                <h2 className="sr-only">Informazioni prodotto</h2>
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>

              {/* Description */}
              {descriptionHtml && (
                <div className="mt-6">
                  <h3 className="sr-only">Descrizione</h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    className="prose prose-sm text-gray-600 max-w-none"
                  />
                </div>
              )}

              {/* Product form with variants and add to cart */}
              <div className="mt-8">
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </div>

              {/* Collapsible details */}
              <section aria-labelledby="details-heading" className="mt-10">
                <h2 id="details-heading" className="sr-only">
                  Dettagli aggiuntivi
                </h2>

                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {productDetails.map((detail) => (
                    <Disclosure key={detail.name} as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-open:text-sky-600">
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden size-6 text-sky-400 group-hover:text-sky-500 group-data-open:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pb-6">
                        {detail.type === 'html' && detail.content ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: detail.content }}
                            className="prose prose-sm text-gray-700"
                          />
                        ) : detail.type === 'list' && detail.items ? (
                          <ul
                            role="list"
                            className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                          >
                            {detail.items.map((item) => (
                              <li key={item} className="pl-2">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
