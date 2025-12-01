import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email || typeof email !== 'string') {
      return json({error: 'Email is required'}, {status: 400});
    }

    const {customerCreate} = await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          acceptsMarketing: true,
        },
      },
    });

    if (customerCreate?.customerUserErrors?.length) {
      // If error is "Email has already been taken", we can consider it a success for the user
      const isEmailTaken = customerCreate.customerUserErrors.some(
        (error: any) => error.code === 'TAKEN',
      );

      if (isEmailTaken) {
        return json({success: true, message: 'You are already subscribed.'});
      }

      return json(
        {error: customerCreate.customerUserErrors[0].message},
        {status: 400},
      );
    }

    return json({success: true, message: 'Welcome to the resistance.'});
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return json({error: 'Failed to subscribe. Check server logs.'}, {status: 500});
  }
}

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
` as const;
