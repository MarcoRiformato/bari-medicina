import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';

export function ProductItem({ product, loading }) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={variantUrl} prefetch="intent">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-3">{product.description}</p>
        )}
        <div className="flex flex-1 flex-col justify-end">
          {/* Options can be added here if available */}
          {product.vendor && (
            <p className="text-sm text-gray-500 italic">{product.vendor}</p>
          )}
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-base font-medium text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
