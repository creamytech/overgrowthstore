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
import {Icons} from '~/components/InlineIcons';

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
  const heading = customer?.firstName || 'Citizen';

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

  // Scavenger Rank calculation
  const orderCount = orders.length;
  const getRank = () => {
    if (orderCount >= 10) return { name: 'Guardian', level: 3, progress: 100 };
    if (orderCount >= 5) return { name: 'Pathfinder', level: 2, progress: ((orderCount - 5) / 5) * 100 };
    if (orderCount >= 1) return { name: 'Scout', level: 1, progress: ((orderCount - 1) / 4) * 100 };
    return { name: 'Drifter', level: 0, progress: 0 };
  };
  const rank = getRank();

  // Registration date (using first order date or current date as fallback)
  const registrationDate = orders.length > 0 
    ? new Date(orders[orders.length - 1].processedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Topographic Map Watermark */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-dark-green">
            <ellipse cx="200" cy="200" rx="180" ry="120"/>
            <ellipse cx="200" cy="200" rx="150" ry="100"/>
            <ellipse cx="200" cy="200" rx="120" ry="80"/>
            <ellipse cx="200" cy="200" rx="90" ry="60"/>
            <ellipse cx="200" cy="200" rx="60" ry="40"/>
            <ellipse cx="200" cy="200" rx="30" ry="20"/>
            <path d="M50 100 Q150 80 250 120 Q350 160 380 100"/>
            <path d="M20 200 Q100 180 200 220 Q300 260 400 200"/>
            <path d="M30 300 Q130 280 230 320 Q330 360 400 300"/>
          </g>
        </svg>
      </div>

      {/* Header - "The Dossier" */}
      <div className="relative z-10 pt-40 pb-8 text-center px-4">
        {/* Citizen ID Badge */}
        <div className="inline-block bg-[#f9f7f3] border-2 border-dark-green/20 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-dark-green/10 rounded-full flex items-center justify-center">
              <Icons.User className="w-8 h-8 text-dark-green/40" />
            </div>
            <div className="text-left">
              <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest">Citizen ID</p>
              <p className="font-heading text-2xl text-dark-green uppercase tracking-wider">{heading}</p>
              <p className="font-mono text-[10px] text-dark-green/40">Registered: {registrationDate}</p>
            </div>
          </div>
        </div>

        {customer.emailAddress?.emailAddress && (
          <p className="font-body text-dark-green/60 text-sm mb-4">
            {customer.emailAddress.emailAddress}
          </p>
        )}
        
        {/* Sign Out */}
        <Form method="post" action={usePrefixPathWithLocale('/account/logout')} className="mt-2">
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 font-mono text-xs text-dark-green/40 hover:text-rust transition-colors uppercase tracking-widest"
          >
            <Icons.SignOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </Form>
      </div>

      {/* Scavenger Rank */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-md mx-auto bg-[#f9f7f3] border border-dark-green/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-rust" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="font-heading text-sm text-dark-green uppercase tracking-widest">Scavenger Rank</span>
            </div>
            <span className="font-mono text-xs text-rust uppercase tracking-widest">{rank.name}</span>
          </div>
          {/* Progress Bar with Moss Fill */}
          <div className="h-3 bg-dark-green/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-dark-green to-rust rounded-full transition-all duration-500"
              style={{ width: `${Math.max(rank.progress, orderCount > 0 ? 25 : 5)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-dark-green/30">Drifter</span>
            <span className="font-mono text-[10px] text-dark-green/30">Scout</span>
            <span className="font-mono text-[10px] text-dark-green/30">Pathfinder</span>
            <span className="font-mono text-[10px] text-dark-green/30">Guardian</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
            <Icons.Package className="w-8 h-8 text-rust mx-auto mb-2" />
            <p className="font-heading text-3xl text-dark-green">{orders.length}</p>
            <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest">Expeditions</p>
          </div>
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
            <Icons.MapPin className="w-8 h-8 text-rust mx-auto mb-2" />
            <p className="font-heading text-3xl text-dark-green">{addresses.length}</p>
            <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest">Drop Points</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-dark-green/20 mb-8">
            {[
              { id: 'orders', label: 'Field Log', Icon: Icons.Package },
              { id: 'addresses', label: 'Drop Points', Icon: Icons.MapPin },
              { id: 'details', label: 'Identity', Icon: Icons.User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-rust' 
                    : 'text-dark-green/40 hover:text-dark-green'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
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
      {/* Empty Rucksack Illustration */}
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <svg className="w-full h-full text-dark-green/20" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Rucksack body */}
          <rect x="14" y="20" width="36" height="36" rx="4"/>
          {/* Flap */}
          <path d="M14 28h36M14 28c0-6 8-12 18-12s18 6 18 12"/>
          {/* Straps */}
          <path d="M20 20v-4M44 20v-4"/>
          {/* Buckle */}
          <rect x="28" y="24" width="8" height="6" rx="1"/>
          {/* Pockets */}
          <rect x="18" y="38" width="10" height="12" rx="2"/>
          <rect x="36" y="38" width="10" height="12" rx="2"/>
        </svg>
        {/* Cobwebs */}
        <svg className="absolute top-0 right-0 w-8 h-8 text-dark-green/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M2 2l20 20M12 2v20M2 12h20M2 2l10 10M12 2l10 10M2 12l10 10"/>
        </svg>
      </div>
      
      <p className="font-heading text-xl text-dark-green mb-2">No Expeditions Recorded</p>
      <p className="font-body text-sm text-dark-green/50 mb-8 max-w-xs mx-auto">
        Your inventory is empty. The ruins are waiting.
      </p>
      <Link 
        to="/products"
        className="inline-flex items-center gap-2 bg-dark-green text-[#f4f1ea] px-6 py-3 font-heading tracking-widest hover:bg-rust transition-colors uppercase"
      >
        <span>Initiate First Haul</span>
        <Icons.ArrowRight className="w-4 h-4" />
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
