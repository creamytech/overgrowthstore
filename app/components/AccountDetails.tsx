import type {CustomerDetailsFragment} from 'customer-accountapi.generated';
import {Link} from '~/components/Link';
import {Icon} from '@iconify/react';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const {firstName, lastName, emailAddress, phoneNumber} = customer;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile */}
        <div>
            <h3 className="font-heading text-lg text-dark-green uppercase tracking-widest mb-4 border-b border-dark-green/10 pb-2 flex items-center gap-2">
                <Icon icon="ph:user" className="w-5 h-5 text-rust" />
                Profile
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="font-body text-[10px] text-dark-green/50 uppercase mb-1">Name</p>
                    <p className="font-body text-dark-green">
                        {firstName || lastName
                        ? (firstName ? firstName + ' ' : '') + lastName
                        : 'Add name'}{' '}
                    </p>
                </div>
                <Link
                    prefetch="intent"
                    className="inline-flex items-center gap-1 text-xs font-body text-rust hover:underline uppercase tracking-wider"
                    to="/account/edit"
                >
                    <Icon icon="ph:pencil-simple" className="w-3 h-3" />
                    Edit Details
                </Link>
            </div>
        </div>

        {/* Contact Info */}
        <div>
            <h3 className="font-heading text-lg text-dark-green uppercase tracking-widest mb-4 border-b border-dark-green/10 pb-2 flex items-center gap-2">
                <Icon icon="ph:envelope" className="w-5 h-5 text-rust" />
                Contact
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="font-body text-[10px] text-dark-green/50 uppercase mb-1">Email</p>
                    <p className="font-body text-dark-green">{emailAddress?.emailAddress ?? 'Not set'}</p>
                </div>
                <div>
                    <p className="font-body text-[10px] text-dark-green/50 uppercase mb-1">Phone</p>
                    <p className="font-body text-dark-green">{phoneNumber?.phoneNumber ?? 'Not set'}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
