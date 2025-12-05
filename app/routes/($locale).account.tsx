import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Link} from '~/components/Link';
import {Suspense, useState} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';
import {Icon} from '@iconify/react';

import type {
  CustomerDetailsFragment,
  OrderCardFragment,
} from 'customer-accountapi.generated';
import {OrderCard} from '~/components/OrderCard';
import {AccountDetails} from '~/components/AccountDetails';
import {AccountAddressBook} from '~/components/AccountAddressBook';
import {Modal} from '~/components/Modal';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

import {doLogout} from './($locale).account_.logout';
import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw await doLogout(context);
  }

  const customer = data?.customer;
  const heading = customer?.firstName || 'Explorer';

  return defer(
    {
      customer,
      heading,
      featuredDataPromise: getFeaturedData(context.storefront),
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  const renderOutletInModal = matches.some((match) => {
    const handle = match?.handle as {renderInModal?: boolean};
    return handle?.renderInModal;
  });

  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...data} customer={data.customer} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} customer={data.customer} />;
}

interface AccountType {
  customer: CustomerDetailsFragment;
  featuredDataPromise: Promise<FeaturedData>;
  heading: string;
}

function Account({customer, heading, featuredDataPromise}: AccountType) {
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'details'>('orders');

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />

      {/* Standard Header */}
      <div className="relative z-10 pt-40 pb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
            <div className="w-2 h-2 border border-rust rotate-45" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
          </div>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          {heading}
        </h1>
        {customer.emailAddress?.emailAddress && (
          <p className="font-body text-dark-green/60 text-lg">
            {customer.emailAddress.emailAddress}
          </p>
        )}
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
        
        {/* Sign Out */}
        <Form method="post" action={usePrefixPathWithLocale('/account/logout')} className="mt-6">
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 font-body text-sm text-dark-green/50 hover:text-rust transition-colors"
          >
            <Icon icon="ph:sign-out" className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </Form>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
            <Icon icon="ph:package" className="w-8 h-8 text-rust mx-auto mb-2" />
            <p className="font-heading text-3xl text-dark-green">{orders.length}</p>
            <p className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Orders</p>
          </div>
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
            <Icon icon="ph:map-pin" className="w-8 h-8 text-rust mx-auto mb-2" />
            <p className="font-heading text-3xl text-dark-green">{addresses.length}</p>
            <p className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Addresses</p>
          </div>
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
            <Icon icon="ph:star" className="w-8 h-8 text-rust mx-auto mb-2" />
            <p className="font-heading text-3xl text-dark-green">Root</p>
            <p className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Tier</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-dark-green/20 mb-8">
            {[
              { id: 'orders', label: 'Order History', icon: 'ph:package' },
              { id: 'addresses', label: 'Addresses', icon: 'ph:map-pin' },
              { id: 'details', label: 'Account Details', icon: 'ph:user' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-body text-xs uppercase tracking-widest transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-rust' 
                    : 'text-dark-green/50 hover:text-dark-green'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 md:p-8">
            {activeTab === 'orders' && <AccountOrderHistory orders={orders} />}
            {activeTab === 'addresses' && <AccountAddressBook addresses={addresses} customer={customer} />}
            {activeTab === 'details' && <AccountDetails customer={customer} />}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <Suspense fallback={null}>
        <Await resolve={featuredDataPromise} errorElement={null}>
          {(data) => (
            <div className="relative z-10 bg-dark-green py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-heading text-2xl text-[#f4f1ea] tracking-widest text-center mb-12">
                  Continue Exploring
                </h2>
                <ProductSwimlane products={data.featuredProducts} />
              </div>
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

type OrderCardsProps = {
  orders: OrderCardFragment[];
};

function AccountOrderHistory({orders}: OrderCardsProps) {
  return (
    <div className="w-full">
      {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="text-center py-12">
      <Icon icon="ph:package" className="w-12 h-12 text-dark-green/20 mx-auto mb-4" />
      <p className="font-body text-dark-green/50 mb-6">No orders yet</p>
      <Link 
        to="/collections"
        className="inline-flex items-center gap-2 bg-dark-green text-[#f4f1ea] px-6 py-3 font-heading tracking-widest hover:bg-rust transition-colors"
      >
        <span>Start Exploring</span>
        <Icon icon="ph:arrow-right" className="w-4 h-4" />
      </Link>
    </div>
  );
}

function Orders({orders}: OrderCardsProps) {
  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}
