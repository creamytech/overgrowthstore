import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {PageHeader, Section} from '~/components/Text';
import {Button} from '~/components/Button';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.policyHandle, 'Missing policy handle');

  const policyName = params.policyHandle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as 'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy';

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.policy({policy, url: request.url});

  return json({policy, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Policies() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8 overflow-hidden">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/texture_paper_creased.jpg')] mix-blend-multiply" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Document Container */}
        <div className="bg-[#f0ede6] border border-dark-green/20 p-8 md:p-16 shadow-lg relative">
            
            {/* Top Secret Stamp */}
            <div className="absolute top-8 right-8 border-4 border-rust/20 text-rust/20 px-4 py-2 font-heading text-2xl -rotate-12 pointer-events-none uppercase tracking-widest mix-blend-multiply mask-grunge">
                OFFICIAL PROTOCOL
            </div>

            {/* Header */}
            <div className="mb-12 border-b-2 border-dark-green/10 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Button
                            className="mb-6 text-rust hover:text-dark-green transition-colors font-typewriter text-xs uppercase tracking-widest flex items-center gap-2"
                            variant="inline"
                            to={'/policies'}
                        >
                            &larr; Return to Index
                        </Button>
                        <h1 className="font-heading text-4xl md:text-5xl text-dark-green mb-2 uppercase tracking-widest">
                            {policy.title}
                        </h1>
                        <p className="font-typewriter text-xs tracking-[0.2em] text-dark-green/60 uppercase">
                            Doc Ref: {policy.handle.toUpperCase()} // Auth: Legal
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-stone max-w-none font-typewriter text-sm leading-relaxed text-dark-green/80">
                <div
                    dangerouslySetInnerHTML={{__html: policy.body}}
                    className="[&>h1]:font-heading [&>h1]:text-2xl [&>h1]:text-dark-green [&>h1]:uppercase [&>h1]:tracking-widest [&>h1]:mb-6
                               [&>h2]:font-heading [&>h2]:text-xl [&>h2]:text-dark-green [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:mb-4 [&>h2]:mt-8
                               [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6
                               [&>a]:text-rust [&>a]:underline [&>a]:decoration-rust/30 [&>a]:underline-offset-4 hover:[&>a]:decoration-rust"
                />
            </div>

            {/* Footer Signature */}
            <div className="mt-16 pt-12 border-t border-dashed border-dark-green/20 flex justify-between items-end">
                <div>
                    <p className="font-typewriter text-[10px] tracking-widest uppercase text-dark-green/40 mb-2">
                        Approved By
                    </p>
                    <div className="font-handwritten text-2xl text-dark-green/60 -rotate-3">
                        Overgrowth Legal
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-typewriter text-[10px] tracking-widest uppercase text-dark-green/40">
                        Page 1 of 1
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyHandle on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesHandle(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...PolicyHandle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...PolicyHandle
      }
      termsOfService @include(if: $termsOfService) {
        ...PolicyHandle
      }
      refundPolicy @include(if: $refundPolicy) {
        ...PolicyHandle
      }
    }
  }
`;
