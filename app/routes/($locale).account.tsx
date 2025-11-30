import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Suspense} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';

import type {
  CustomerDetailsFragment,
  OrderCardFragment,
} from 'customer-accountapi.generated';
import {PageHeader, Text} from '~/components/Text';
import {Button} from '~/components/Button';
import {OrderCard} from '~/components/OrderCard';
import {AccountDetails} from '~/components/AccountDetails';
import {AccountAddressBook} from '~/components/AccountAddressBook';
import {Modal} from '~/components/Modal';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {FeaturedCollections} from '~/components/FeaturedCollections';
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

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (errors?.length || !data?.customer) {
    throw await doLogout(context);
  }

  const customer = data?.customer;

  const heading = customer
    ? customer.firstName
      ? `PERSONNEL FILE: ${customer.firstName.toUpperCase()}`
      : `CLASSIFIED RECORD`
    : 'PERSONNEL FILE';

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

  // routes that export handle { renderInModal: true }
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

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="border-b-2 border-dark-green pb-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
            <h1 className="font-heading text-4xl md:text-6xl text-dark-green tracking-widest uppercase mb-2">
                {heading}
            </h1>
            <p className="font-typewriter text-sm text-rust tracking-widest uppercase">
                STATUS: ACTIVE // CLEARANCE: LEVEL 4
            </p>
        </div>

        <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
          <button type="submit" className="font-heading text-sm text-rust border border-rust px-6 py-2 hover:bg-rust hover:text-[#f4f1ea] transition-colors uppercase tracking-widest">
            Discharge (Sign Out)
          </button>
        </Form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          
          {/* Left Column: Orders */}
          <div>
             <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 bg-dark-green flex items-center justify-center text-[#f4f1ea] font-heading">A</div>
                <h2 className="font-heading text-2xl text-dark-green uppercase tracking-widest">Supply Requisitions</h2>
             </div>
             
             <div className="bg-[#f0eee6] border border-dark-green/20 p-6 md:p-8 relative">
                {/* Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply" style={{backgroundImage: "url('/assets/texture_archive_paper.jpg')"}} />
                
                <div className="relative z-10">
                    {orders && <AccountOrderHistory orders={orders} />}
                </div>
             </div>
          </div>

          {/* Right Column: Addresses & Details */}
          <div className="space-y-12">
             
             {/* Addresses */}
             <div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 bg-rust flex items-center justify-center text-[#f4f1ea] font-heading">B</div>
                    <h2 className="font-heading text-2xl text-dark-green uppercase tracking-widest">Deployment Coordinates</h2>
                </div>
                <div className="bg-white/50 border border-dark-green/20 p-6 relative">
                    <AccountAddressBook addresses={addresses} customer={customer} />
                </div>
             </div>

             {/* Personal Details */}
             <div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 bg-dark-green/50 flex items-center justify-center text-[#f4f1ea] font-heading">C</div>
                    <h2 className="font-heading text-2xl text-dark-green uppercase tracking-widest">Operative Data</h2>
                </div>
                <div className="bg-white/50 border border-dark-green/20 p-6 relative">
                    <AccountDetails customer={customer} />
                </div>
             </div>

          </div>
      </div>

      {!orders.length && (
        <Suspense>
          <Await
            resolve={featuredDataPromise}
            errorElement="There was a problem loading featured products."
          >
            {(data) => (
              <div className="mt-24 border-t border-dark-green/20 pt-12">
                <h3 className="font-heading text-2xl text-dark-green mb-8 text-center uppercase tracking-widest">Recommended Equipment</h3>
                <ProductSwimlane products={data.featuredProducts} />
              </div>
            )}
          </Await>
        </Suspense>
      )}
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
      <Text className="mb-4 font-typewriter text-dark-green/60" as="p">
        No requisitions found in archive.
      </Text>
      <div className="w-full flex justify-center">
        <Button
          className="btn-stamp text-sm"
          variant="secondary"
          to={usePrefixPathWithLocale('/')}
        >
          Initiate Requisition
        </Button>
      </div>
    </div>
  );
}

function Orders({orders}: OrderCardsProps) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}
