import { Await, useLoaderData, Link } from 'react-router';
import { Suspense, useEffect } from 'react';
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

  useEffect(() => {
    const seenSrcs = new Set();
    console.group('[ImageDebugger] scan started');
    const imgs = document.querySelectorAll('img');

    console.log(`[ImageDebugger] Found ${imgs.length} images on page.`);

    imgs.forEach((img, i) => {
      const src = img.getAttribute('src'); // Get raw attribute
      const isComplete = img.complete;
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const status = isComplete ? (w > 0 ? 'LOADED' : 'BROKEN (0px)') : 'LOADING';
      const isDuplicate = seenSrcs.has(src);
      seenSrcs.add(src);

      const logMethod = isDuplicate ? console.warn : console.log;
      logMethod(`[IMG #${i}] Status: ${status} | Size: ${w}x${h} | Duplicate: ${isDuplicate} | Src: ${src}`);

      if (isDuplicate) {
        console.warn(`[ImageDebugger] DUPLICATE DETECTED: ${src}`);
      }

      if (!isComplete && src) {
        img.addEventListener('load', () => console.log(`[IMG #${i} EVENT] Loaded late: ${src}`));
        img.addEventListener('error', () => console.error(`[IMG #${i} EVENT] FAILED: ${src}`));
      }
    });
    console.groupEnd();
  }, []);

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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-16 lg:py-24">
          {/* Left content */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Qualità Farmaceutica Certificata
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-gray-900 leading-tight">
              La scienza al servizio del tuo{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                benessere
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
              Integratori formulati per supportare il tuo stile di vita attivo. Ingredienti puri, risultati tangibili.
            </p>

            {/* CTA buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                style={{ color: 'white' }}
              >
                Scopri la Collezione
              </Link>
              <Link
                to="/pages/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                Parla con un Esperto
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Spedizione Gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>100% Naturale</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Made in Italy</span>
              </div>
            </div>
          </div>

          {/* Right image grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    alt="Vitamine e integrazione"
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    alt="Benessere quotidiano"
                    src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    alt="Ricerca e sviluppo"
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    alt="Analisi scientifica"
                    src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
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
      title: 'Nuovi Arrivi',
      handle: 'nuovi-arrivi',
      image: {
        url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Nuovi arrivi integrazione',
      },
      featured: true,
    },
    {
      id: '2',
      title: 'Benessere',
      handle: 'benessere',
      image: {
        url: 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Benessere e Yoga',
      },
    },
    {
      id: '3',
      title: 'Energia',
      handle: 'energia',
      image: {
        url: 'https://images.unsplash.com/photo-1552668693-d0738e00eca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        altText: 'Energia e Sport',
      },
    },
  ];

  // Use real collections if available, otherwise use fallback
  const displayCollections = collections && collections.length >= 3 ? collections.slice(0, 3) : fallbackCategories;
  const featuredCollection = displayCollections[0];
  const otherCollections = displayCollections.slice(1);

  const categoryBadges = ['Più Richiesta', 'Tendenza', 'Popolare'];

  return (
    <section aria-labelledby="category-heading" className="bg-gradient-to-b from-gray-50 to-white relative z-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-3">
            Esplora le Collezioni
          </span>
          <h2 id="category-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Acquista per Categoria
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Trova l'integratore perfetto per le tue esigenze specifiche.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-2 lg:gap-8">
          {/* Featured card */}
          <Link to={`/collections/${featuredCollection.handle}`} className="group relative aspect-[4/3] sm:aspect-auto overflow-hidden rounded-3xl sm:row-span-2 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300">
            <img
              alt={featuredCollection.image?.altText || featuredCollection.title}
              src={featuredCollection.image?.url || `https://picsum.photos/seed/${featuredCollection.id}/800/600`}
              className="absolute size-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md">
                {categoryBadges[0]}
              </span>
            </div>
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
                  {featuredCollection.title}
                </h3>
                <p className="mt-2 text-sm text-gray-200">Scopri la nostra selezione premium</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold group-hover:bg-white/30 transition-colors">
                  Esplora Ora
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Other cards */}
          {otherCollections.map((collection, index) => (
            <Link to={`/collections/${collection.handle}`} key={collection.id} className="group relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-3xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300">
              <img
                alt={collection.image?.altText || collection.title}
                src={collection.image?.url || `https://picsum.photos/seed/${collection.id}/800/400`}
                className="absolute size-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md">
                  {categoryBadges[(index + 1) % categoryBadges.length]}
                </span>
              </div>
              <div className="absolute inset-0 flex items-end p-5 sm:p-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
                    {collection.title}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white font-semibold group-hover:bg-white/30 transition-colors">
                    Scopri
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/collections" className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 bg-transparent px-8 py-3 text-base font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
            Vedi Tutte le Categorie
            <span aria-hidden="true" className="ml-2">&rarr;</span>
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
            src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            className="size-full object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900/50" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 id="cause-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Il Nostro Impegno
          </h2>
          <p className="mt-3 text-xl text-white">
            Ci impegniamo per una produzione responsabile, etica e sostenibile. Il nostro approccio farmaceutico
            ci permette di garantire la massima purezza e biodisponibilità, riducendo l'impatto ambientale.
            La tua salute è la nostra priorità.
          </p>
          <Link
            to="/pages/contact"
            className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
          >
            Scopri la nostra storia
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
      title: 'Proteine Isolate Puro',
      handle: 'proteine-isolate',
      priceRange: {
        minVariantPrice: {
          amount: '45.00',
          currencyCode: 'EUR',
        },
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        altText: 'Proteine',
      },
    },
    {
      id: '2',
      title: 'Multivitaminico Daily',
      handle: 'multivitaminico',
      priceRange: {
        minVariantPrice: {
          amount: '22.00',
          currencyCode: 'EUR',
        },
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        altText: 'Multivitaminico',
      },
    },
    {
      id: '3',
      title: 'Omega-3 Artico',
      handle: 'omega-3',
      priceRange: {
        minVariantPrice: {
          amount: '28.00',
          currencyCode: 'EUR',
        },
      },
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        altText: 'Omega-3',
      },
    },
  ];

  return (
    <section aria-labelledby="favorites-heading" className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
            I Più Venduti
          </span>
          <h2 id="favorites-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            I Nostri Preferiti
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Scopri i prodotti più amati dai nostri clienti, selezionati per qualità e risultati.
          </p>
        </div>

        <Suspense fallback={<FavoritesGrid products={fallbackProducts} />}>
          <Await resolve={products}>
            {(response) => {
              const displayProducts = response?.products?.nodes || fallbackProducts;
              return <FavoritesGrid products={displayProducts.slice(0, 3)} />;
            }}
          </Await>
        </Suspense>

        <div className="mt-10 text-center">
          <Link to="/collections" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300">
            Vedi Tutti i Prodotti
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>

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
  const badges = ['Best Seller', 'Più Venduto', 'Novità'];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
      {products.map((product, index) => (
        <div key={product.id} className="group relative overflow-hidden rounded-3xl bg-white border border-blue-100 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)] hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.35)] hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md">
              {badges[index % badges.length]}
            </span>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              alt={product.featuredImage?.altText || product.title}
              src={product.featuredImage?.url || `https://picsum.photos/seed/${product.id}/400/300`}
              className="h-56 sm:h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">(128)</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
              <Link to={`/products/${product.handle}`}>
                <span className="absolute inset-0" />
                {product.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {product.description || 'Integratore premium per il tuo benessere quotidiano.'}
            </p>

            {/* Price & CTA */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 line-through">€{(parseFloat(product.priceRange.minVariantPrice.amount) * 1.2).toFixed(2)}</span>
                <div className="text-xl font-black text-gray-900">
                  <Money data={product.priceRange.minVariantPrice} />
                </div>
              </div>
              <div className="relative z-10 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full group-hover:bg-blue-700 transition-colors pointer-events-none">
                Scopri
              </div>
            </div>
          </div>
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
                <h2 id="sale-heading" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-2xl">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Offerte Esclusive.
                  </span>
                  <br />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg">
                    Fino al 50% di sconto.
                  </span>
                </h2>
                <div className="mt-6">
                  <Link to="/collections" className="inline-block rounded-md bg-white px-8 py-3 text-base font-bold text-gray-900 shadow-lg hover:bg-gray-100">
                    Approfitta degli sconti
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0 overflow-hidden">
                <div className="ml-24 flex space-x-6 sm:ml-3 lg:space-x-8">
                  <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt="Integratori proteici"
                        src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt="Vitamine"
                        src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt="Benessere"
                        src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt="Ricerca scientifica"
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                    <div className="shrink-0">
                      <img
                        alt="Fitness"
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="size-64 rounded-lg object-cover md:size-72"
                      />
                    </div>

                    <div className="mt-6 shrink-0 sm:mt-0">
                      <img
                        alt="Omega-3"
                        src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
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
