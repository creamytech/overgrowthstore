import {flattenConnection, Image} from '@shopify/hydrogen';
import {Icon} from '@iconify/react';

import type {OrderCardFragment} from 'customer-accountapi.generated';
import {Heading, Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: OrderCardFragment}) {
  if (!order?.id) return null;

  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const lineItems = flattenConnection(order?.lineItems);
  const fulfillmentStatus = flattenConnection(order?.fulfillments)[0]?.status;
  const url = key
    ? `/account/orders/${legacyOrderId}?${key}`
    : `/account/orders/${legacyOrderId}`;

  return (
    <li className="border border-dark-green/20 bg-[#f9f7f3] hover:border-rust transition-colors">
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        to={url}
        prefetch="intent"
      >
        {lineItems[0].image && (
          <div className="aspect-square bg-[#f4f1ea] overflow-hidden">
            <Image
              width={168}
              height={168}
              className="w-full h-full object-cover"
              alt={lineItems[0].image?.altText ?? 'Order image'}
              src={lineItems[0].image.url}
            />
          </div>
        )}
        <div
          className={`flex flex-col justify-center text-left ${
            !lineItems[0].image && 'md:col-span-2'
          }`}
        >
          <h3 className="font-heading text-lg text-dark-green mb-2">
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </h3>
          <dl className="space-y-1">
            <div className="flex items-center gap-2">
              <Icon icon="ph:hash" className="w-3 h-3 text-dark-green/40" />
              <dd className="font-body text-sm text-dark-green/60">
                Order #{order.number}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="ph:calendar-blank" className="w-3 h-3 text-dark-green/40" />
              <dd className="font-body text-sm text-dark-green/60">
                {new Date(order.processedAt).toDateString()}
              </dd>
            </div>
            {fulfillmentStatus && (
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-body uppercase tracking-widest ${
                    fulfillmentStatus === 'SUCCESS'
                      ? 'bg-dark-green/10 text-dark-green border border-dark-green/20'
                      : 'bg-rust/10 text-rust border border-rust/20'
                  }`}
                >
                  <Icon 
                    icon={fulfillmentStatus === 'SUCCESS' ? 'ph:check' : 'ph:clock'} 
                    className="w-3 h-3" 
                  />
                  {statusMessage(fulfillmentStatus)}
                </span>
              </div>
            )}
          </dl>
        </div>
      </Link>
      <div className="border-t border-dark-green/10">
        <Link
          className="flex items-center justify-center gap-2 w-full p-3 font-body text-sm text-dark-green/60 hover:text-rust transition-colors"
          to={url}
          prefetch="intent"
        >
          <span>View Details</span>
          <Icon icon="ph:arrow-right" className="w-4 h-4" />
        </Link>
      </div>
    </li>
  );
}

export const ORDER_CARD_FRAGMENT = `#graphql
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;
