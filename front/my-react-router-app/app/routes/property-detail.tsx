import { Link, type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type * as Route from "./+types.home";
import { getUserId } from "~/services/session.service";
import { getPropertyId } from "~/services/api.service";

export const meta: MetaFunction = () => {
  return [
    { title: "rental manager home" },
    { name: "description", content: "Welcome to my app to manage rentals" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  } else {
    return await getPropertyId(request, request.pid);
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {loaderData? (
        <div className="container mx-auto gap-2 flex flex-row">  
          <h1 className="text-2xl p-4">Welcome TOTO to Rental manager application</h1>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {loaderData && (
        <pre className="p-4 bg-gray-100 rounded">
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      )}
    </div>
  );
}