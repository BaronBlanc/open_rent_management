import { Form, redirect, type MetaFunction } from "react-router";
import type * as Route from "./+types.login";
import { createSession, getUserTokenInformation, login } from "~/services/session.server";

export const meta: MetaFunction = () => {
    return [
      { title: "rental manager login" },
      { name: "description", content: "Welcome to my app to manage rentals" },
    ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userTokenData = await getUserTokenInformation(request);
  if (userTokenData) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const loginResponse = await login(username, password);

  if (loginResponse?.status === 200 && loginResponse.data) {
    const tokenData = loginResponse.data;
    const sessionResponse = await createSession({ request }, username, tokenData);

    if ("error" in sessionResponse) {
      return { error: sessionResponse.error };
    }

    return sessionResponse;
  }

  return { error: "Invalid email or password" };
}


export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="p-8 min-w-3/4 w-96">
      <h1 className="text-2xl">Rental manager: Login</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">Username:</label>
            <input className="flex-1" type="text" name="email" />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input className="flex-1" type="password" name="password" />
          </div>
          <div className="flex flex-row-reverse mt-4">
            <button type="submit" className="border rounded px-2.5 py-1 w-32">
              Login
            </button>
          </div>
          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
