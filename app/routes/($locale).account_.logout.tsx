import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@shopify/remix-oxygen';

export async function doLogout(context: ActionFunctionArgs['context']) {
  const {session} = context;
  session.unset('customerAccessToken');

  // The only file where I have to explicitly type cast i18n to pass typecheck
  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export async function loader({context}: LoaderFunctionArgs) {
  return doLogout(context);
}
