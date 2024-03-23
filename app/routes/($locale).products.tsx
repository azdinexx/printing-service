import { LoaderFunctionArgs } from "@remix-run/server-runtime";

export async function loader({context}: LoaderFunctionArgs) {

  const products = await context.storefront.query(PRODC)

  return {
    products
  };
}
