import { Form, redirect, type MetaFunction } from "react-router";
import type * as Route from "./+types.login";
import { createSession, getUserTokenInformation, login } from "~/services/session.server";
import Input from "~/components/input";
import Button from "~/components/button";

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
    <div className="container mx-auto p-4 flex justify-center">
      <Form method="post" className="mt-6">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl">Login or subscribe</h1>
            <Input
              label="Username"
              name="email"
              type="text"
              placeholder="Enter your username"
              className=""
              required = {true}
            />
            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className=""
                required = {true}
              />
          <div className="flex flex-row">
            <Button type="submit" label="Login" />
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
