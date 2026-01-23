import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';

export function ProductItem({ product, loading }) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="aspect-h-4 aspect-w-3 bg-blue-100 sm:aspect-none group-hover:opacity-90 sm:h-96">
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover object-center sm:h-full sm:w-full group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-5">
        <h3 className="text-lg font-bold text-gray-900 font-serif">
          <Link to={variantUrl} prefetch="intent">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
        )}
        <div className="flex flex-1 flex-col justify-end">
          {product.vendor && (
            <p className="text-sm text-blue-600 font-medium">{product.vendor}</p>
          )}
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-xl font-bold text-gray-900 mt-2"
          />
        </div>
      </div>
    </div>
  );
}
