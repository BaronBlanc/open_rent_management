import { Form, Link } from "react-router";
import Button from "./button";

interface HeaderProps {
    userTokenData?: {
      userId?: string;
    };
  }

export default function Header ({ userTokenData }: HeaderProps) {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between">
          <nav className="container mx-auto">
            <h1 className="text-2xl">Rental Manager</h1>
          </nav>
          {userTokenData?.userId ? (
          <nav className="container mx-auto flex justify-end">
            <Form action="/logout" method="post">
                <Button type="submit" className="border rounded px-2.5 py-1 " label="Logout" />
            </Form>
          </nav>
        ) : (
          <Link to="/login"></Link>
        )}
        </header>
    );
};
