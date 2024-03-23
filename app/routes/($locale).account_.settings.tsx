import {Form} from '@remix-run/react';
import React from 'react';
import {ActionFunctionArgs} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  console.log(email);
  return {
    error: null,
    newCustomer: null,
  };
}

function Settings() {
  return (
    <main className="">
      <Form
        method="POST"
        className="flex gap-3 flex-col p-4 border mx-auto mt-20 rounded-xl bg-white/80"
      >
        <input type="hidden" name="_method" value="PUT"></input>
        <input type="hidden" name="_csrf" value=""></input>
        <input type="hidden" name="utf8" value="✓"></input>
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
            ></input>
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
            ></input>
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
        ></input>
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
        ></input>
        <label htmlFor="pwd" className="text-sm">
          Re-enter password
        </label>
        <input
          id="pwd"
          name="pwd"
          type="password"
          autoComplete="current-password"
          placeholder="Re-enter password"
          aria-label="Re-enter password"
          minLength={8}
          required
        ></input>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Update My
        </button>
      </Form>
    </main>
  );
}

export default Settings;
