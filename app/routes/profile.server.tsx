import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOMER_FRAGMENT} from '~/graphql/customer-account/CustomerDetailsQuery';

export const loader = async ({request, context}: LoaderFunctionArgs) => {
  const {session, storefront} = context;

  try {
    const customerData = await storefront.query(CUSTOMER_FRAGMENT);
    // Assuming customerData is the fetched customer information
    return defer({
      user: customerData, // Return the fetched customer data
    });
  } catch (error) {
    console.error('Failed to fetch customer data:', error);
    // Handle the error appropriately, e.g., by returning an error response
    return defer({
      error: 'Failed to fetch customer data',
    });
  }
};
