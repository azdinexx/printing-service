/* eslint-disable prettier/prettier */
import type {CustomerCreateMutation} from 'storefrontapi.generated';
import {Form, Link, json, redirect, useActionData} from '@remix-run/react';

import type {
  ActionFunction,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import type {MetaFunction} from '@shopify/remix-oxygen';
import {useEffect} from 'react';
import {toast} from 'sonner';
type ActionResponse = {
  error: string | null;
  newCustomer:
    | NonNullable<CustomerCreateMutation['customerCreate']>['customer']
    | null;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/print');
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
  const firstName = form.has('firstName')
    ? String(form.get('firstName'))
    : null;
  const lastName = form.has('lastName') ? String(form.get('lastName')) : null;
  const passwordConfirm = form.has('passwordConfirm')
    ? String(form.get('passwordConfirm'))
    : null;

  const validPasswords =
    password && passwordConfirm && password === passwordConfirm;

  const validInputs = Boolean(email && password && lastName && firstName);
  try {
    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    if (!validInputs) {
      throw new Error('Please provide all fields.');
    }

    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password, lastName, firstName, acceptsMarketing: true},
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div className="flex justify-center items-center mt-20">
      <div>
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="text-gray-500 mb-4 max-w-xs">
          Welcome! Explore the future with us
        </p>

        <Form method="POST" className="py-5 flex flex-col gap-4 border-y">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 w-full">
              <label htmlFor="firstName" className="text-sm">
                First Name
              </label>
              <input
                autoFocus
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                aria-label="firstName"
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label htmlFor="lastName" className="text-sm">
                last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="last Name"
                aria-label="lastName"
              />
            </div>
          </div>
          <label htmlFor="email" className="text-sm">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
          />
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            minLength={8}
            required
          />

          <label htmlFor="pwd" className="text-sm">
            Re-enter password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="Re-enter password"
            aria-label="Re-enter password"
            minLength={8}
            required
          />
          <div className="flex gap-4 items-center">
            <input
              type="checkbox"
              id="acceptsMarketing"
              name="acceptsMarketing"
              defaultChecked
            />
            <label htmlFor="acceptsMarketing" className="text-sm">
              I want to receive news, offers and other promotional materials
            </label>
          </div>
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
