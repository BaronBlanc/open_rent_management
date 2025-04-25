import { Link, type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type * as Route from "./+types.home";
import { getUserTokenInformation } from "~/services/session.service";

export const meta: MetaFunction = () => {
  return [
    { title: "rental manager home" },
    { name: "description", content: "Welcome to my app to manage rentals" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userTokenData = await getUserTokenInformation(request);
  if (!userTokenData) {
    throw redirect("/login");
  } else {
    return { userTokenData };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {loaderData?.userTokenData?.userId ? (
        <div className="container mx-auto gap-2 flex flex-row">  
          <h1 className="text-2xl p-4">Welcome {loaderData.userTokenData.userId} to Rental manager application</h1>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}