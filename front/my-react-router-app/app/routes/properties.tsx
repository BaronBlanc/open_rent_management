import { Link, type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type * as Route from "./+types.home";
import { getUserTokenInformation } from "~/services/session.service";
import { getProperties } from "~/services/api.service";
import DataTable from "~/components/datatable";
import { createColumnHelper } from "@tanstack/react-table";
import type { Property } from "~/model/property";

export const meta: MetaFunction = () => {
  return [
    { title: "rental manager home" },
    { name: "description", content: "Welcome to my app to manage rentals" },
  ];
};

const columnHelper = createColumnHelper<Property>()

const columns = [
  columnHelper.accessor(row => row.name, {
    id: 'name',
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor(row => row.description, {
    id: 'description',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Description</span>,
  }),
  columnHelper.accessor(row => row.date_created, {
    id: 'date_created',
    cell: info => info.getValue(),
    header: () => <span>Date create</span>,
  }),
  columnHelper.accessor(row => row.date_updated, {
    id: 'date_updated',
    cell: info => info.getValue(),
    header: () => <span>Date update</span>,
  }),
]

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userTokenData = await getUserTokenInformation(request);
  if (!userTokenData) {
    throw redirect("/login");
  } else {
    return await getProperties(request);
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
      <DataTable data={loaderData} columns={columns}  />
    </div>
  );
}