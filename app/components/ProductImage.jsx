import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  if (!image) {
    return <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200" />;
  }
  return (
    <Image
      alt={image.altText || 'Product Image'}
      aspectRatio="1/1"
      data={image}
      key={image.id}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="h-full w-full object-cover object-center"
    />
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
