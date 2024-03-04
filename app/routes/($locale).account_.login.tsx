import {Form, Link, json, redirect, useActionData} from '@remix-run/react';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

type ActionResponse = {
  error: string | null;
};
export const meta = () => {
  return [{title: 'Log In'}];
};
export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account/orders');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/print', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

function LogIn() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <div className=" flex justify-center items-center border border-black  ">
      <div className="mx-auto mt-20 mb-36">
        <h1 className="text-4xl font-bold">Log In</h1>
        <p className="text-stone-500 mb-4 max-w-xs">
          Welcome back! Explore the future with us
        </p>
        {error ? (
          <p>
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

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md"
          >
            Log In
          </button>
        </Form>
        <p className="py-4">
          Don&apos;t have an account?{' '}
          <Link className="text-blue-500" to="/account/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LogIn;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
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
