import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Newsletter API - Uses Shopify Admin API to create customers with marketing consent
 * POST /api/newsletter with FormData containing 'email' and optional 'phone'
 */
export async function action({request, context}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const phone = formData.get('phone');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');

    if (!email || typeof email !== 'string') {
      return json({success: false, error: 'Email is required'}, {status: 400});
    }

    // Format phone to E.164 if provided
    let phoneValue: string | null = null;
    if (typeof phone === 'string' && phone.trim()) {
      // Remove all non-digit characters except +
      let cleaned = phone.trim().replace(/[^+\d]/g, '');
      
      // If it starts with a digit (no +), assume US and add +1
      if (cleaned && !cleaned.startsWith('+')) {
        // If it's 10 digits, it's a US number without country code
        if (cleaned.length === 10) {
          cleaned = '+1' + cleaned;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
          cleaned = '+' + cleaned;
        } else {
          // Add + prefix for other cases
          cleaned = '+' + cleaned;
        }
      }
      
      phoneValue = cleaned;
      console.log('[Newsletter] Formatted phone:', phone, '->', phoneValue);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({success: false, error: 'Please enter a valid email address'}, {status: 400});
    }

    const {env} = context;
    
    // Check if Admin API credentials are configured
    if (!env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
      console.error('SHOPIFY_ADMIN_API_ACCESS_TOKEN is not configured');
      // Fallback to Storefront API if Admin API not configured
      return handleStorefrontFallback(email, context, firstName as string, lastName as string, phoneValue);
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
            phone
            emailMarketingConsent {
              marketingState
            }
            smsMarketingConsent {
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

    // Build tags array
    const tags = ['Overgrowth Vault'];
    if (phoneValue) {
      tags.push('SMS Opt-in');
    }

    const variables = {
      input: {
        email,
        phone: phoneValue,
        firstName: typeof firstName === 'string' ? firstName : undefined,
        lastName: typeof lastName === 'string' ? lastName : undefined,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          consentUpdatedAt: new Date().toISOString(),
        },
        ...(phoneValue ? {
          smsMarketingConsent: {
            marketingState: 'SUBSCRIBED',
            consentUpdatedAt: new Date().toISOString(),
          },
        } : {}),
        tags,
        note: phoneValue ? `SMS consent given via website popup. Phone: ${phoneValue}` : undefined,
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

    console.log('[Newsletter] Admin API called with phone:', phoneValue);

    if (!response.ok) {
      console.error('Admin API Error:', response.status, await response.text());
      return json({success: false, error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    const result = await response.json() as {
      data?: {
        customerCreate?: {
          customer?: {id: string; email: string; phone?: string};
          userErrors?: Array<{field: string[]; message: string}>;
        };
      };
      errors?: Array<{message: string}>;
    };

    console.log('[Newsletter] Admin API result:', JSON.stringify(result, null, 2));

    // Check for GraphQL errors
    if (result.errors?.length) {
      console.error('Admin API GraphQL Error:', result.errors);
      return json({success: false, error: 'Failed to subscribe. Please try again.'}, {status: 500});
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
        console.log('[Newsletter] Customer exists, attempting to update with phone...');
        // If they exist and we have a phone, try to update them
        if (phoneValue) {
          await updateCustomerPhone(adminApiUrl, adminApiToken, email, phoneValue);
        }
        return json({success: true, message: 'You\'re already on the list!'});
      }

      console.log('[Newsletter] User errors:', userErrors);
      return json({success: false, error: userErrors[0].message}, {status: 400});
    }

    console.log('[Newsletter] Customer created successfully with phone:', result.data?.customerCreate?.customer?.phone);
    return json({success: true, message: 'Welcome to the Overgrowth.'});
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return json({success: false, error: 'Something went wrong. Please try again.'}, {status: 500});

  }
}

/**
 * Fallback to Storefront API if Admin API is not configured
 */
async function handleStorefrontFallback(
  email: string, 
  context: any, 
  firstName?: string | null, 
  lastName?: string | null,
  phone?: string | null
) {
  console.log('[Newsletter] Using Storefront API fallback for:', email, phone ? '(with phone)' : '');
  
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

    // Generate a strong password that meets Shopify requirements (5+ chars)
    const randomPassword = 'Ovg!' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    
    console.log('[Newsletter] Calling storefront.mutate...');
    
    const result = await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          password: randomPassword,
          acceptsMarketing: true,
        },
      },
    });

    console.log('[Newsletter] Mutation result:', JSON.stringify(result, null, 2));

    const customerCreate = result?.customerCreate;

    if (customerCreate?.customerUserErrors?.length) {
      const errors = customerCreate.customerUserErrors;
      console.log('[Newsletter] Customer creation errors:', errors);
      
      const isEmailTaken = errors.some(
        (error: {code: string}) => error.code === 'TAKEN' || error.code === 'CUSTOMER_DISABLED',
      );

      if (isEmailTaken) {
        return json({success: true, message: 'You\'re already on the list!'});
      }

      return json(
        {success: false, error: errors[0].message || 'Signup failed'},
        {status: 400},
      );
    }

    console.log('[Newsletter] Customer created successfully');
    return json({success: true, message: 'Welcome to the Overgrowth.'});
  } catch (error: any) {
    console.error('[Newsletter] Storefront Fallback Error:', error?.message || error);
    console.error('[Newsletter] Error stack:', error?.stack);
    return json({success: false, error: error?.message || 'Failed to subscribe.'}, {status: 500});
  }
}

/**
 * Update existing customer with phone number and SMS consent
 */
async function updateCustomerPhone(adminApiUrl: string, adminApiToken: string, email: string, phone: string) {
  try {
    console.log('[Newsletter] Updating existing customer phone for:', email);
    
    // First, find the customer by email
    const searchQuery = `
      query findCustomer($query: String!) {
        customers(first: 1, query: $query) {
          nodes {
            id
          }
        }
      }
    `;
    
    const searchResponse = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken,
      },
      body: JSON.stringify({
        query: searchQuery,
        variables: { query: `email:${email}` }
      }),
    });
    
    const searchResult = await searchResponse.json() as {
      data?: { customers?: { nodes?: Array<{id: string}> } };
    };
    
    const customerId = searchResult.data?.customers?.nodes?.[0]?.id;
    
    if (!customerId) {
      console.log('[Newsletter] Customer not found for update');
      return;
    }
    
    console.log('[Newsletter] Found customer:', customerId);
    
    // Update the customer with phone
    const updateMutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            phone
            smsMarketingConsent {
              marketingState
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const updateResponse = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken,
      },
      body: JSON.stringify({
        query: updateMutation,
        variables: {
          input: {
            id: customerId,
            phone,
            smsMarketingConsent: {
              marketingState: 'SUBSCRIBED',
              consentUpdatedAt: new Date().toISOString(),
            },
            tags: ['Overgrowth Vault', 'SMS Opt-in'],
            note: `SMS consent given via website popup. Phone: ${phone}`,
          }
        }
      }),
    });
    
    const updateResult = await updateResponse.json();
    console.log('[Newsletter] Customer update result:', JSON.stringify(updateResult, null, 2));
    
  } catch (error) {
    console.error('[Newsletter] Error updating customer phone:', error);
  }
}
