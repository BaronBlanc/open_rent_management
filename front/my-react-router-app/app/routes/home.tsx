import { Form, Link, type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type * as Route from "./+types.home";
import { getUserTokenInformation } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "rental manager home" },
    { name: "description", content: "Welcome to my app to manage rentals" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userTokenData = await getUserTokenInformation(request);
  console.log("userTokenData", userTokenData);
  if (!userTokenData) {
    throw redirect("/login");
  } else {
    return { userTokenData };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to Rental manager application</h1>
      <div className="mt-6">
        {loaderData?.userId ? (
          <div>
            <p className="mb-6">You are logged in {loaderData?.userId}</p>
            <Form action="/logout" method="post">
              <button type="submit" className="border rounded px-2.5 py-1">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}