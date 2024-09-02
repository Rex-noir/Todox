import { Outlet } from "react-router-dom";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export function Auth() {
  return (
    <div className="w-full px-3 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Outlet />
      </div>
      <div className="hidden bg-muted lg:block">
        <p>Placeholder</p>
      </div>
    </div>
  );
}
