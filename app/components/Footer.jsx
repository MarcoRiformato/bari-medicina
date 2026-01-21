import { NavLink } from 'react-router';

export function Footer({ menu, shop, publicStoreDomain }) {
  return (
    <footer className="bg-gray-900 mt-auto" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} publicStoreDomain={publicStoreDomain} />
        <p className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterMenu({ menu, primaryDomainUrl, publicStoreDomain }) {
  const fallbackMenu = {
    id: 'fallback',
    items: [{ id: '1', title: 'Home', url: '/' }],
  };

  const footerMenu = menu || fallbackMenu;

  return (
    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4" aria-label="Footer">
      {footerMenu.items.map((item) => {
        if (!item.url) return null;

        const url = item.url.includes('myshopify.com')
          || item.url.includes(publicStoreDomain)
          || item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;

        const isExternal = !url.startsWith('/');

        return isExternal ? (
          <a
            key={item.id}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            key={item.id}
            to={url}
            end
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive
                ? 'font-semibold text-white'
                : 'text-gray-400 hover:text-gray-300'
              }`
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
