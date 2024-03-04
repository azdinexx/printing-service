/* eslint-disable prettier/prettier */
import type {CustomerCreateMutation} from 'storefrontapi.generated';
import {Form, Link, json, redirect, useActionData} from '@remix-run/react';

import type {
  ActionFunction,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import type {MetaFunction} from '@shopify/remix-oxygen';
type ActionResponse = {
  error: string | null;
  newCustomer:
    | NonNullable<CustomerCreateMutation['customerCreate']>['customer']
    | null;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account/orders');
  }
  return json({});
}

export const action: ActionFunction = async ({request, context}) => {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {storefront, session} = context;
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  const password = form.has('password') ? String(form.get('password')) : null;
  const passwordConfirm = form.has('passwordConfirm')
    ? String(form.get('passwordConfirm'))
    : null;

  const validPasswords =
    password && passwordConfirm && password === passwordConfirm;

  const validInputs = Boolean(email && password);
  try {
    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password},
      },
    });

    if (customerCreate?.customerUserErrors?.length) {
      throw new Error(customerCreate?.customerUserErrors[0].message);
    }

    const newCustomer = customerCreate?.customer;
    if (!newCustomer?.id) {
      throw new Error('Could not create customer');
    }

    // get an access token for the new customer
    const {customerAccessTokenCreate} = await storefront.mutate(
      REGISTER_LOGIN_MUTATION,
      {
        variables: {
          input: {
            email,
            password,
          },
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error('Missing access token');
    }
    session.set(
      'customerAccessToken',
      customerAccessTokenCreate?.customerAccessToken,
    );

    return json(
      {error: null, newCustomer},
      {
        status: 302,
        headers: {
          'Set-Cookie': await session.commit(),
          Location: '/print',
        },
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
};

export const meta: MetaFunction = () => {
  return [{title: 'Sign Up'}];
};

function SignUp() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <div className="grid place-items-center  grid-cols-1 grid-rows-1 mb-36 mt-20">
      <div>
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="text-stone-500 mb-4 max-w-xs">
          Welcome! Explore the future with us
        </p>
        {error ? (
          <p className="bg-yellow-500">
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <Form method="POST" className="flex flex-col gap-4 max-w-sm">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="pl-4 p-2 rounded-md"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            minLength={8}
            required
            className="pl-4 p-2 rounded-md"
          />

          <label htmlFor="pwd">Re-enter password</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="current-password"
            placeholder="Re-enter password"
            aria-label="Re-enter password"
            minLength={8}
            required
            className="pl-4 p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md"
          >
            Sign Up
          </button>
        </Form>
        <p className="py-4">
          Already signed Up?{' '}
          <Link className="text-blue-500" to="/account/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
const CUSTOMER_CREATE_MUTATION = `#graphql
    mutation customerCreate(
      $input: CustomerCreateInput!,
      $country: CountryCode,
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  ` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const REGISTER_LOGIN_MUTATION = `#graphql
    mutation registerLogin(
      $input: CustomerAccessTokenCreateInput!,
      $country: CountryCode,
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
  ` as const;
