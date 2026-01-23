import { useState } from 'react';
import { NavLink } from 'react-router';
import { Suspense } from 'react';
import { Await } from 'react-router';
import { useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  HomeIcon,
  TagIcon,
  InformationCircleIcon,
  PhoneIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { useAside } from './Aside';

function getIconForTitle(title) {
  const t = title.toLowerCase();
  if (t.includes('home')) return HomeIcon;
  if (t.includes('catalog') || t.includes('catalogo') || t.includes('shop') || t.includes('prodotti')) return TagIcon;
  if (t.includes('about') || t.includes('chi siamo') || t.includes('azienda')) return InformationCircleIcon;
  if (t.includes('contact') || t.includes('contatti')) return PhoneIcon;
  if (t.includes('store') || t.includes('negoz')) return ArchiveBoxIcon;
  return TagIcon; // Default
}

// ... existing static navigation object can remain if needed for fallback ...

export function Header({ cart, isLoggedIn, menu, shop, publicStoreDomain, header }) {
  const [open, setOpen] = useState(false);

  // Build navigation from Shopify menu
  const navigationItems = menu?.items?.map(item => ({
    name: item.title,
    href: item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain || '')
      ? new URL(item.url).pathname
      : item.url
  })) || [];

  return (
    <>
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6 mt-6">
              {navigationItems.map((item) => {
                const Icon = getIconForTitle(item.name);
                return (
                  <div key={item.name} className="flow-root">
                    <NavLink to={item.href} onClick={() => setOpen(false)} className="-m-2 flex items-center p-2 font-medium text-gray-900">
                      <Icon className="size-5 mr-3 text-gray-500" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <Suspense fallback={
                  <NavLink to="/account" className="-m-2 flex items-center p-2 font-medium text-gray-900">
                    <UserIcon aria-hidden="true" className="size-5 mr-2" />
                    Accedi / Registrati
                  </NavLink>
                }>
                  <Await resolve={isLoggedIn}>
                    {(loggedIn) => (
                      <NavLink to="/account" className="-m-2 flex items-center p-2 font-medium text-gray-900">
                        <UserIcon aria-hidden="true" className="size-5 mr-2" />
                        {loggedIn ? 'Il Mio Account' : 'Accedi / Registrati'}
                      </NavLink>
                    )}
                  </Await>
                </Suspense>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top navigation */}
        <nav aria-label="Top" className="relative z-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <NavLink to="/" className="text-xl font-bold text-gray-900">
                  Bari Medicina
                </NavLink>
              </div>

              {/* Navigation links */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-8">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Suspense fallback={
                    <NavLink to="/account" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                      <UserIcon aria-hidden="true" className="size-5 mr-1" />
                      Accedi
                    </NavLink>
                  }>
                    <Await resolve={isLoggedIn}>
                      {(loggedIn) => (
                        <NavLink to="/account" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                          <UserIcon aria-hidden="true" className="size-5 mr-1" />
                          {loggedIn ? 'Account' : 'Accedi'}
                        </NavLink>
                      )}
                    </Await>
                  </Suspense>
                </div>

                {/* Search */}
                <SearchButton />

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <CartToggle cart={cart} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

function SearchButton() {
  const { open } = useAside();

  return (
    <div className="flex lg:ml-6">
      <button onClick={() => open('search')} className="p-2 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Search</span>
        <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
      </button>
    </div>
  );
}

function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="group -m-2 flex items-center p-2"
    >
      <ShoppingBagIcon
        aria-hidden="true"
        className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{count || 0}</span>
      <span className="sr-only">items in cart, view bag</span>
    </button>
  );
}

function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          const optimisticCart = useOptimisticCart(cart);
          return <CartBadge count={optimisticCart?.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

// Keep the existing HeaderMenu for specialized logic if we need to revert or reuse logic
export function HeaderMenu({ menu, primaryDomainUrl, publicStoreDomain }) {
  // Not used in this new implementation but kept to avoid breaking imports elsewhere if any
  return null;
}
