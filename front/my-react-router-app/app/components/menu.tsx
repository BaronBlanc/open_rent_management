import { Link } from "react-router";

export default function Menu() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex flex-col gap-4 md:gap-8 justify-center items-center">
        <li>
            <Link
            to="/"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
            >
            Home
            </Link>
        </li>
        <li>
          <Link
            to="/properties"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
          >
            Properties
          </Link>
        </li>
        <li>
          <Link
            to="/tenants"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
          >
            Tenants
          </Link>
        </li>
        <li>
          <Link
            to="/rentals"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
          >
            Rentals
          </Link>
        </li>
        <li>
          <Link
            to="/inventories"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
          >
            Inventories
          </Link>
        </li>
        <li>
          <Link
            to="/finance"
            className="hover:text-indigo-400 hover:text-lg transition duration-300 ease-in-out"
          >
            Finance
          </Link>
        </li>
      </ul>
    </nav>
  );
}