import { Await, useLoaderData, Link } from 'react-router';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{ title: 'Hydrogen | Home' }];
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
async function loadCriticalData({ context }) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTIONS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollections: collections.nodes,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({ context }) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Category section */}
      <CategorySection collections={data.featuredCollections} />

      {/* Featured section */}
      <FeaturedSection />

      {/* Favorites section */}
      <FavoritesSection products={data.recommendedProducts} />

      {/* CTA section */}
      <CTASection />
    </>
  );
}

function HeroSection() {
  return (
    <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
      <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
        <div className="sm:max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Summer styles are finally here
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            This year, our new summer collection will shelter you from the harsh elements of a world that doesn't
            care if you live or die.
          </p>
        </div>
        <div>
          <div className="mt-10">
            {/* Decorative image grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
            >
              <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero1/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero2/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero3/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero4/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero5/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero6/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/hero7/176/256"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/collections"
              className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collections: Array<any>;
 * }}
 */
function CategorySection({ collections }) {
  // Fallback hardcoded categories
  const fallbackCategories = [
    {
      id: '1',
      title: 'New Arrivals',
      handle: 'new-arrivals',
      image: {
        url: 'https://picsum.photos/seed/cat1/800/800',
        altText: 'New arrivals collection',
      },
      featured: true,
    },
    {
      id: '2',
      title: 'Accessories',
      handle: 'accessories',
      image: {
        url: 'https://picsum.photos/seed/cat2/800/600',
        altText: 'Accessories collection',
      },
    },
    {
      id: '3',
      title: 'Workspace',
      handle: 'workspace',
      image: {
        url: 'https://picsum.photos/seed/cat3/800/600',
        altText: 'Workspace collection',
      },
    },
  ];

  // Use real collections if available, otherwise use fallback
  const displayCollections = collections && collections.length >= 3 ? collections.slice(0, 3) : fallbackCategories;
  const featuredCollection = displayCollections[0];
  const otherCollections = displayCollections.slice(1);

  return (
    <section aria-labelledby="category-heading" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 id="category-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Shop by Category
          </h2>
          <Link to="/collections" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
          <div className="group relative aspect-2/1 overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
            {featuredCollection.image ? (
              <img
                alt={featuredCollection.image.altText || featuredCollection.title}
                src={featuredCollection.image.url}
                className="absolute size-full object-cover group-hover:opacity-75"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link to={`/collections/${featuredCollection.handle}`}>
                    <span className="absolute inset-0" />
                    {featuredCollection.title}
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Shop now
                </p>
              </div>
            </div>
          </div>
          {otherCollections.map((collection) => (
            <div key={collection.id} className="group relative aspect-2/1 overflow-hidden rounded-lg sm:aspect-auto">
              {collection.image ? (
                <img
                  alt={collection.image.altText || collection.title}
                  src={collection.image.url}
                  className="absolute size-full object-cover group-hover:opacity-75"
                />
              ) : null}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"
              />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="font-semibold text-white">
                    <Link to={`/collections/${collection.handle}`}>
                      <span className="absolute inset-0" />
                      {collection.title}
                    </Link>
                  </h3>
                  <p aria-hidden="true" className="mt-1 text-sm text-white">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link to="/collections" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  return (
    <section aria-labelledby="cause-heading">
      <div className="relative bg-gray-800 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            src="https://picsum.photos/seed/featured/1920/800"
            className="size-full object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900/50" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 id="cause-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Long-term thinking
          </h2>
          <p className="mt-3 text-xl text-white">
            We're committed to responsible, sustainable, and ethical manufacturing. Our small-scale approach allows
            us to focus on quality and reduce our impact. We're doing our best to delay the inevitable heat-death of
            the universe.
          </p>
          <Link
            to="#"
            className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function FavoritesSection({ products }) {
  // Fallback hardcoded products
  const fallbackProducts = [
    {
      id: '1',
      title: 'Black Basic Tee',
      handle: 'black-basic-tee',
      priceRange: {
        minVariantPrice: {
          amount: '32.00',
          currencyCode: 'USD',
        },
      },
      featuredImage: {
        url: 'https://picsum.photos/seed/prod1/600/900',
        altText: 'Black Basic Tee',
      },
    },
    {
      id: '2',
      title: 'Off-White Basic Tee',
      handle: 'off-white-basic-tee',
      priceRange: {
        minVariantPrice: {
          amount: '32.00',
          currencyCode: 'USD',
        },
      },
      featuredImage: {
        url: 'https://picsum.photos/seed/prod2/600/900',
        altText: 'Off-White Basic Tee',
      },
    },
    {
      id: '3',
      title: 'Mountains Artwork Tee',
      handle: 'mountains-artwork-tee',
      priceRange: {
        minVariantPrice: {
          amount: '36.00',
          currencyCode: 'USD',
        },
      },
      featuredImage: {
        url: 'https://picsum.photos/seed/prod3/600/900',
        altText: 'Mountains Artwork Tee',
      },
    },
  ];

  return (
    <section aria-labelledby="favorites-heading">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Our Favorites
          </h2>
          <Link to="/collections" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
            Browse all favorites
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <Suspense fallback={<FavoritesGrid products={fallbackProducts} />}>
          <Await resolve={products}>
            {(response) => {
              const displayProducts = response?.products?.nodes || fallbackProducts;
              return <FavoritesGrid products={displayProducts.slice(0, 3)} />;
            }}
          </Await>
        </Suspense>

        <div className="mt-6 sm:hidden">
          <Link to="/collections" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Browse all favorites
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   products: Array<any>;
 * }}
 */
function FavoritesGrid({ products }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          {product.featuredImage ? (
            <img
              alt={product.featuredImage.altText || product.title}
              src={product.featuredImage.url}
              className="h-96 w-full rounded-lg object-cover group-hover:opacity-75 sm:aspect-2/3 sm:h-auto"
            />
          ) : null}
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            <Link to={`/products/${product.handle}`}>
              <span className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      ))}
    </div>
  );
}

function CTASection() {
  return (
    <section aria-labelledby="sale-heading">
      <div className="overflow-hidden pt-32 sm:pt-14">
        <div className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative pt-48 pb-16 sm:pb-24">
              <div>
                <h2 id="sale-heading" className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Final Stock.
                  <br />
                  Up to 50% off.
                </h2>
                <div className="mt-6 text-base">
                  <Link to="#" className="font-semibold text-white">
                    Shop the sale
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                  <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta1/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta2/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta3/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta4/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta5/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt=""
                        src="https://picsum.photos/seed/cta6/288/288"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURED_COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
