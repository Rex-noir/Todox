import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useTodoxStore } from "@/stores/todox/todoxStore";

export const Todos = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { projectId } = useParams();

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const getTitle = () => {
    if (projectId) {
      const project = useTodoxStore.getState().projects[projectId];
      return project ? project.title : "Unknown Project";
    }
  };

  return (
    <div className="grid h-full min-h-screen gap-4 bg-gray-100 md:grid-cols-[18rem,1fr]">
      <div className="fixed left-0 top-0 hidden h-full bg-slate-200 shadow-lg md:block">
        <LayoutMenu />
      </div>
      <div className="grid h-full grid-rows-[60px,1fr] md:col-start-2 md:grid-rows-1">
        <div className="fixed left-0 right-0 top-0 z-10 bg-white shadow-md md:hidden">
          <MobileHeader projectTitle={isScrolled ? getTitle() : ""} />
        </div>
        <main className="row-start-2 h-full md:row-start-1">
          <div className="min-h-screen w-full rounded-md sm:p-3 md:px-10 lg:p-10 lg:px-32">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
