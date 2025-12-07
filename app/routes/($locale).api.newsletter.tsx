import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Newsletter API - Uses Shopify Admin API to create customers with marketing consent
 * POST /api/newsletter with FormData containing 'email'
 */
export async function action({request, context}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email || typeof email !== 'string') {
      return json({ok: false, error: 'Email is required'}, {status: 400});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ok: false, error: 'Please enter a valid email address'}, {status: 400});
    }

    const {env} = context;
    
    // Check if Admin API credentials are configured
    if (!env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
      console.error('SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured');
      // Fallback to Storefront API if Admin API not configured
      return handleStorefrontFallback(email, context);
    }

    const shopDomain = env.PUBLIC_STORE_DOMAIN;
    const adminApiVersion = env.SHOPIFY_ADMIN_API_VERSION || '2025-01';
    const adminApiToken = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    // Admin API GraphQL endpoint
    const adminApiUrl = `https://${shopDomain}/admin/api/${adminApiVersion}/graphql.json`;

    const mutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
            }
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          consentUpdatedAt: new Date().toISOString(),
        },
        tags: ['Overgrowth Vault'],
      },
    };

    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken,
      },
      body: JSON.stringify({query: mutation, variables}),
    });

    if (!response.ok) {
      console.error('Admin API Error:', response.status, await response.text());
      return json({ok: false, error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    const result = await response.json() as {
      data?: {
        customerCreate?: {
          customer?: {id: string; email: string};
          userErrors?: Array<{field: string[]; message: string}>;
        };
      };
      errors?: Array<{message: string}>;
    };

    // Check for GraphQL errors
    if (result.errors?.length) {
      console.error('Admin API GraphQL Error:', result.errors);
      return json({ok: false, error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    const userErrors = result.data?.customerCreate?.userErrors;
    
    if (userErrors?.length) {
      // Check if customer already exists (email taken)
      const isEmailTaken = userErrors.some(
        (error) => error.message.toLowerCase().includes('email') && 
                   (error.message.toLowerCase().includes('taken') || 
                    error.message.toLowerCase().includes('already'))
      );

      if (isEmailTaken) {
        // Treat as success - they're already signed up
        return json({ok: true, message: 'You\'re already on the list!'});
      }

      return json({ok: false, error: userErrors[0].message}, {status: 400});
    }

    return json({ok: true, message: 'Welcome to the Overgrowth.'});
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return json({ok: false, error: 'Something went wrong. Please try again.'}, {status: 500});
  }
}

/**
 * Fallback to Storefront API if Admin API is not configured
 */
async function handleStorefrontFallback(email: string, context: any) {
  try {
    const CUSTOMER_CREATE_MUTATION = `#graphql
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            acceptsMarketing
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const {customerCreate} = await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Date.now().toString(36), // Random password
          acceptsMarketing: true,
        },
      },
    });

    if (customerCreate?.customerUserErrors?.length) {
      const isEmailTaken = customerCreate.customerUserErrors.some(
        (error: {code: string}) => error.code === 'TAKEN',
      );

      if (isEmailTaken) {
        return json({ok: true, message: 'You\'re already on the list!'});
      }

      return json(
        {ok: false, error: customerCreate.customerUserErrors[0].message},
        {status: 400},
      );
    }

    return json({ok: true, message: 'Welcome to the Overgrowth.'});
  } catch (error) {
    console.error('Storefront Fallback Error:', error);
    return json({ok: false, error: 'Failed to subscribe.'}, {status: 500});
  }
}
