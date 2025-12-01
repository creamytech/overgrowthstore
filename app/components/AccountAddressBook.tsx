import {Form} from '@remix-run/react';
import type {CustomerAddress} from '@shopify/hydrogen/customer-account-api-types';

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
          <Text className="mb-4 font-typewriter text-dark-green/60" width="narrow" as="p" size="copy">
            No coordinates established.
          </Text>
        )}
        <div className="w-48">
          <Button
            to="address/add"
            className="btn-stamp text-xs w-full mb-6"
            variant="secondary"
          >
            Add Coordinates
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
    <div className="p-6 border border-dark-green/20 bg-[#f4f1ea] relative flex flex-col hover:border-rust transition-colors duration-300">
      {defaultAddress && (
        <div className="mb-3 flex flex-row">
          <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-rust text-rust bg-rust/5">
            Primary Base
          </span>
        </div>
      )}
      <ul className="flex-1 flex-col font-typewriter text-sm text-dark-green space-y-1">
        {(address.firstName || address.lastName) && (
          <li className="font-bold uppercase tracking-wider mb-2">
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="flex flex-row font-heading text-xs mt-6 items-baseline gap-6">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left text-rust hover:underline uppercase tracking-wider"
          prefetch="intent"
        >
          Edit
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-left text-dark-green/40 hover:text-rust uppercase tracking-wider">
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}
