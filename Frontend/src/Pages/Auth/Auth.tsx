import { ApiResponse, User } from "@/interfaces/types";
import { login, logout } from "@/stores/auth/actions";
import { AxiosResponse } from "axios";
import { Suspense, useEffect } from "react";
import { Await, Navigate, Outlet, useLoaderData } from "react-router-dom";
import Splash from "../Splash";

export function Auth() {
  const { user } = useLoaderData() as {
    user: Promise<AxiosResponse<ApiResponse<User>>>;
  };

  useEffect(() => {
    user.then((value) => login(value.data.data)).catch(() => logout());
  });

  return (
    <Suspense fallback={<Splash />}>
      <Await
        resolve={user}
        errorElement={
          <div className="h-screen max-h-screen w-full px-3 lg:grid lg:grid-cols-2">
            <div className="flex flex-col flex-wrap items-center justify-center py-3 lg:py-12">
              <img src="/icon.svg" className="lg:hidden" />
              <Outlet />
            </div>
            <div className="hidden flex-col items-center justify-center bg-muted lg:flex">
              <img src="/icon.svg" />
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Todox{" "}
              </h1>{" "}
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Simple | Elegant | OS
              </p>{" "}
            </div>
          </div>
        }
      >
        {() => <Navigate to={"/app"} />}
      </Await>
    </Suspense>
  );
}
