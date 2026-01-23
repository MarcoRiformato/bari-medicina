import { NavLink } from 'react-router';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Italian fallback footer navigation
const footerNavigation = {
  shop: [
    { name: 'Tutti i Prodotti', href: '/collections' },
    { name: 'Vitamine', href: '/collections/vitamine' },
    { name: 'Enzimi', href: '/collections/enzimi' },
  ],
  company: [
    { name: 'Contattaci', href: '/pages/contact' },
  ],
  account: [
    { name: 'Cerca', href: '/search' },
  ],
  connect: [
    { name: 'Contattaci', href: '/pages/contact' },
  ],
};

export function Footer({ footer, shop, publicStoreDomain }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  // Extract menu from footer query result (footer.menu)
  const menu = footer?.menu;

  // Debug: Log footer data to help troubleshoot
  if (!menu?.items?.length) {
    console.log('[Footer] No Shopify footer menu found. Using fallback navigation. To fix: Create a menu with handle "footer" in Shopify Admin > Navigation');
  }

  // Use Shopify menu if available, otherwise use fallback
  const useShopifyMenu = menu?.items && menu.items.length > 0;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
    setEmail('');
  };

  return (
    <footer aria-labelledby="footer-heading" className="bg-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
          {useShopifyMenu ? (
            // Render Shopify menu as a simple list
            <div className="grid grid-cols-2 gap-8 xl:col-span-2 md:grid-cols-4">
              {menu.items.map((item) => (
                <div key={item.id}>
                  <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {item.items?.length > 0 ? (
                      item.items.map((subItem) => (
                        <li key={subItem.id} className="text-sm">
                          <NavLink
                            to={subItem.url.includes('myshopify.com') || subItem.url.includes(publicStoreDomain || '')
                              ? new URL(subItem.url).pathname
                              : subItem.url
                            }
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm">
                        <NavLink
                          to={item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain || '')
                            ? new URL(item.url).pathname
                            : item.url
                          }
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.title}
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            // Render fallback navigation
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="space-y-16 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Shop</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.shop.map((item) => (
                      <li key={item.name} className="text-sm">
                        <NavLink to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Company</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name} className="text-sm">
                        <NavLink to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-16 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Account</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.account.map((item) => (
                      <li key={item.name} className="text-sm">
                        <NavLink to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Connect</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.connect.map((item) => (
                      <li key={item.name} className="text-sm">
                        <NavLink to={item.href} className="text-gray-500 hover:text-gray-600">
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="mt-16 xl:mt-0">
            <h3 className="text-sm font-medium text-gray-900">Iscriviti alla Newsletter</h3>
            <p className="mt-6 text-sm text-gray-500">Le ultime offerte e novità, direttamente nella tua inbox.</p>
            <form className="mt-2 flex sm:max-w-md" onSubmit={handleNewsletterSubmit}>
              <input
                id="email-address"
                type="email"
                required
                autoComplete="email"
                placeholder="Inserisci la tua email"
                aria-label="Indirizzo email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />

              <div className="ml-4 shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                >
                  Iscriviti
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 py-10">
          <p className="text-sm text-gray-500">Copyright &copy; 2025 Bari Medicina. Tutti i diritti riservati.</p>
        </div>
      </div>

      {/* Newsletter Success Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircleIcon aria-hidden="true" className="size-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold text-gray-900">
                    Iscrizione Confermata!
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Grazie per esserti iscritto alla nostra newsletter. Riceverai le ultime offerte e novità direttamente nella tua inbox.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Chiudi
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </footer>
  );
}
