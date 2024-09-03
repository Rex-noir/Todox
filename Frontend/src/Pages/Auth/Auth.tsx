import { Outlet } from "react-router-dom";

export function Auth() {
  return (
    <div className="h-screen max-h-screen w-full px-3 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <Outlet />
      </div>
      <div className="hidden flex-col items-center justify-center bg-muted lg:flex">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Todox{" "}
        </h1>{" "}
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Simple | Elegant | OS
        </p>{" "}
      </div>
    </div>
  );
}
