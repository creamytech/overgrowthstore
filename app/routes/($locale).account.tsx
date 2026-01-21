import {
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Link} from '~/components/Link';
import {useState} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';

import type {
  CustomerDetailsFragment,
  OrderCardFragment,
} from 'customer-accountapi.generated';
import {OrderCard} from '~/components/OrderCard';
import {AccountDetails} from '~/components/AccountDetails';
import {AccountAddressBook} from '~/components/AccountAddressBook';
import {Modal} from '~/components/Modal';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';

import {doLogout} from './($locale).account_.logout';

export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw await doLogout(context);
  }

  const customer = data?.customer;
  const heading = customer?.firstName || 'Account';

  return defer(
    {
      customer,
      heading,
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
          <Account customer={data.customer} heading={data.heading} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account customer={data.customer} heading={data.heading} />;
}

interface AccountType {
  customer: CustomerDetailsFragment;
  heading: string;
}

function Account({customer, heading}: AccountType) {
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'details'>('orders');

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO Header */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-16 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#F2EFE9]/10" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#F2EFE9]/10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Member Portal
            </span>
            <div className="w-8 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl text-[#F2EFE9] tracking-[0.1em] uppercase mb-4">
            {heading}
          </h1>
          
          {customer.emailAddress?.emailAddress && (
            <p className="font-mono text-sm text-[#F2EFE9]/50">
              {customer.emailAddress.emailAddress}
            </p>
          )}
        </div>
        
        {/* Stats bar */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-2 gap-px bg-[#F2EFE9]/10">
            <div className="bg-[#0a0a0a] py-4 text-center">
              <span className="font-heading text-2xl text-[#F2EFE9]">{orders.length}</span>
              <span className="font-mono text-[9px] text-[#F2EFE9]/40 uppercase tracking-[0.2em] block mt-1">Recoveries</span>
            </div>
            <div className="bg-[#0a0a0a] py-4 text-center">
              <span className="font-heading text-2xl text-[#F2EFE9]">{addresses.length}</span>
              <span className="font-mono text-[9px] text-[#F2EFE9]/40 uppercase tracking-[0.2em] block mt-1">Locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-12">

        {/* Tabs */}
        <div className="flex border-b border-[#1a472a]/10 mb-8">
          {[
            {id: 'orders', label: 'Order History'},
            {id: 'addresses', label: 'Addresses'},
            {id: 'details', label: 'Account Details'},
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-[#B55A3C]' 
                  : 'text-[#8A8A84] hover:text-[#1a472a]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#B55A3C]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#1a472a]/5 border border-[#1a472a]/10 p-6 md:p-8">
          {activeTab === 'orders' && <AccountOrderHistory orders={orders} />}
          {activeTab === 'addresses' && <AccountAddressBook addresses={addresses} customer={customer} />}
          {activeTab === 'details' && <AccountDetails customer={customer} />}
        </div>

        {/* Sign Out */}
        <div className="mt-8 text-center">
          <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
            <button 
              type="submit" 
              className="font-mono text-[10px] text-[#8A8A84] hover:text-[#B55A3C] uppercase tracking-[0.2em] transition-colors"
            >
              Sign Out →
            </button>
          </Form>
        </div>
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
      <span className="font-mono text-[10px] text-[#8A8A84]/60 tracking-[0.3em] uppercase block mb-4">
        [ Empty ]
      </span>
      <h3 className="font-heading text-xl text-[#1a472a] uppercase tracking-[0.1em] mb-2">
        No Orders Yet
      </h3>
      <p className="font-mono text-xs text-[#8A8A84] mb-8">
        Start shopping to fill your order history.
      </p>
      <Button asChild className="px-8 py-4 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em]">
        <Link to="/products">
          Browse Archive →
        </Link>
      </Button>
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
