import type {CustomerDetailsFragment} from 'customer-accountapi.generated';
import {Link} from '~/components/Link';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const {firstName, lastName, emailAddress, phoneNumber} = customer;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identity */}
        <div>
            <h3 className="font-heading text-lg text-dark-green uppercase tracking-widest mb-4 border-b border-dark-green/10 pb-2">
                Identity
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="font-mono text-[10px] text-dark-green/50 uppercase mb-1">Operative Name</p>
                    <p className="font-typewriter text-dark-green">
                        {firstName || lastName
                        ? (firstName ? firstName + ' ' : '') + lastName
                        : 'Add name'}{' '}
                    </p>
                </div>
                <Link
                    prefetch="intent"
                    className="inline-block text-xs font-heading text-rust hover:underline uppercase tracking-wider"
                    to="/account/edit"
                >
                    Edit Data
                </Link>
            </div>
        </div>

        {/* Comms */}
        <div>
            <h3 className="font-heading text-lg text-dark-green uppercase tracking-widest mb-4 border-b border-dark-green/10 pb-2">
                Comms
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="font-mono text-[10px] text-dark-green/50 uppercase mb-1">Frequency (Email)</p>
                    <p className="font-typewriter text-dark-green">{emailAddress?.emailAddress ?? 'N/A'}</p>
                </div>
                <div>
                    <p className="font-mono text-[10px] text-dark-green/50 uppercase mb-1">Signal (Phone)</p>
                    <p className="font-typewriter text-dark-green">{phoneNumber?.phoneNumber ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
