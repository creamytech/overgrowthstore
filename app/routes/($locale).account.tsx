import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Link} from '~/components/Link';
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
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero / Header Section */}
        <div className="mb-16 text-center">
            <div className="inline-block border border-rust/50 bg-rust/10 px-4 py-1 mb-6 backdrop-blur-sm">
                <span className="font-mono text-xs text-rust tracking-widest uppercase">
                    AUTHORIZED CLEARANCE: LVL 3
                </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2 uppercase">
                {heading}
            </h1>
            <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
                <span>SUBJECT: OPERATIVE DOSSIER</span>
            </div>
            <div className="w-24 h-1 bg-rust mx-auto mt-6" />

            <div className="font-typewriter text-sm tracking-[0.3em] text-dark-green/60 uppercase mt-4">
                <span>Ref: {customer?.id?.substring(customer.id.length - 8) || 'UNKNOWN'}</span>
            </div>
            
             <Form method="post" action={usePrefixPathWithLocale('/account/logout')} className="mt-8">
                <button type="submit" className="font-heading text-sm text-rust border border-rust px-6 py-2 hover:bg-rust hover:text-[#f4f1ea] transition-colors uppercase tracking-widest">
                  Discharge (Sign Out)
                </button>
              </Form>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* 01 // CULTIVATION STATUS */}
            <div className="space-y-6">
                <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider border-b border-dark-green/20 pb-2">
                    01 // Artifact Index
                </h2>
                <div className="bg-[#f4f1ea] border border-dark-green/20 p-8 relative overflow-hidden group hover:border-rust transition-colors duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="font-heading text-2xl text-dark-green uppercase tracking-widest mb-1">Artifact Index</h2>
                            <p className="font-typewriter text-xs text-dark-green/60 uppercase">Current Rank: THE ROOT</p>
                        </div>
                        <div className="w-12 h-12 border border-dark-green/30 rounded-full flex items-center justify-center">
                            <span className="font-heading text-xl text-dark-green">🌱</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-mono text-dark-green mb-2">
                            <span>150 ARTIFACTS</span>
                            <span>500 ARTIFACTS</span>
                        </div>
                        <div className="w-full h-3 bg-dark-green/10 rounded-full overflow-hidden">
                            <div className="h-full bg-rust w-[30%] relative">
                                <div className="absolute right-0 top-0 bottom-0 w-px bg-[#f4f1ea]/50"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="font-typewriter text-[10px] text-dark-green/50 uppercase">
                            Next Reward: 10% OFF NEXT HAUL
                        </p>
                        <Link to="/pages/ecosystem" className="font-heading text-xs text-rust hover:underline uppercase tracking-widest">
                            View Protocol
                        </Link>
                    </div>
                </div>
            </div>

            {/* 02 // OPERATIVE COORDINATES */}
            <div className="space-y-6">
                <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider border-b border-dark-green/20 pb-2">
                    02 // Operative Coordinates
                </h2>
                <div className="bg-[#f4f1ea] border border-dark-green/20 p-6 relative min-h-[200px]">
                    <AccountAddressBook addresses={addresses} customer={customer} />
                </div>
            </div>

            {/* 03 // REQUISITION LOG */}
            <div className="space-y-6 lg:col-span-2">
                <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider border-b border-dark-green/20 pb-2">
                    03 // Requisition Log
                </h2>
                <AccountOrderHistory orders={orders} />
            </div>
            
             {/* 04 // OPERATIVE DATA */}
            <div className="space-y-6 lg:col-span-2">
                <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider border-b border-dark-green/20 pb-2">
                    04 // Operative Data
                </h2>
                 <div className="bg-[#f4f1ea] border border-dark-green/20 p-6 relative">
                      <AccountDetails customer={customer} />
                  </div>
            </div>

        </div>

        {/* Continue Mission Supply */}
        <Suspense>
          <Await
            resolve={featuredDataPromise}
            errorElement="There was a problem loading featured products."
          >
            {(data) => (
              <div className="mt-24 border-t border-dark-green/20 pt-12">
                <h3 className="font-heading text-2xl text-dark-green mb-8 text-center uppercase tracking-widest">Continue Mission Supply</h3>
                <ProductSwimlane products={data.featuredProducts} />
              </div>
            )}
          </Await>
        </Suspense>
      </div>
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
