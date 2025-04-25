import { Link, type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type * as Route from "./+types.home";
import { getUserId } from "~/services/session.service";
import { getTenants } from "~/services/api.service";
import DataTable from "~/components/datatable";
import { createColumnHelper } from "@tanstack/react-table";
import type { Tenant } from "~/model/tenant";

export const meta: MetaFunction = () => {
  return [
    { title: "rental manager home" },
    { name: "description", content: "Welcome to my app to manage rentals" },
  ];
};

const columnHelper = createColumnHelper<Tenant>()

const columns = [
  columnHelper.accessor(row => row.firstname, {
    id: 'firstname',
    cell: info => info.getValue(),
    header: () => <span>Firstname</span>,
  }),
  columnHelper.accessor(row => row.surname, {
    id: 'surname',
    cell: info => info.getValue(),
    header: () => <span>Surname</span>,
  }),
  columnHelper.accessor(row => row.description, {
    id: 'description',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Description</span>,
  }),
  columnHelper.accessor(row => row.phone, {
    id: 'phone',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Phone</span>,
  }),
  columnHelper.accessor(row => row.email, {
    id: 'email',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Email</span>,
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
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  } else {
    return await getTenants(request);
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