import {Form} from '@remix-run/react';
import type {CustomerAddress} from '@shopify/hydrogen/customer-account-api-types';
import {Icon} from '@iconify/react';

import type {CustomerDetailsFragment} from 'customer-accountapi.generated';
import {Button} from '~/components/Button';
import {Text} from '~/components/Text';
import {Link} from '~/components/Link';

export function AccountAddressBook({
  customer,
  addresses,
}: {
  customer: CustomerDetailsFragment;
  addresses: CustomerAddress[];
}) {
  return (
    <>
      <div className="w-full">
        {!addresses?.length && (
          <div className="text-center py-8">
            <Icon icon="ph:map-pin" className="w-10 h-10 text-dark-green/20 mx-auto mb-4" />
            <Text className="mb-4 font-body text-dark-green/60" width="narrow" as="p" size="copy">
              No addresses saved yet.
            </Text>
          </div>
        )}
        <div className="w-48 mb-6">
          <Button
            to="address/add"
            className="text-xs w-full"
            variant="secondary"
          >
            Add Address
          </Button>
        </div>
        {Boolean(addresses?.length) && (
          <div className="grid grid-cols-1 gap-6">
            {customer.defaultAddress && (
              <Address address={customer.defaultAddress} defaultAddress />
            )}
            {addresses
              .filter((address) => address.id !== customer.defaultAddress?.id)
              .map((address) => (
                <Address key={address.id} address={address} />
              ))}
          </div>
        )}
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: CustomerAddress;
  defaultAddress?: boolean;
}) {
  return (
    <div className="p-6 border border-dark-green/20 bg-[#f9f7f3] relative flex flex-col hover:border-rust transition-colors duration-300">
      {defaultAddress && (
        <div className="mb-3 flex flex-row items-center gap-2">
          <Icon icon="ph:star" className="w-4 h-4 text-rust" />
          <span className="text-[10px] font-body uppercase tracking-widest text-rust">
            Default
          </span>
        </div>
      )}
      <ul className="flex-1 flex-col font-body text-sm text-dark-green space-y-1">
        {(address.firstName || address.lastName) && (
          <li className="font-heading uppercase tracking-wider mb-2">
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="flex flex-row font-body text-xs mt-6 items-baseline gap-6">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left text-rust hover:underline uppercase tracking-wider flex items-center gap-1"
          prefetch="intent"
        >
          <Icon icon="ph:pencil-simple" className="w-3 h-3" />
          <span>Edit</span>
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-dark-green/40 hover:text-rust uppercase tracking-wider flex items-center gap-1">
            <Icon icon="ph:trash" className="w-3 h-3" />
            <span>Remove</span>
          </button>
        </Form>
      </div>
    </div>
  );
}
