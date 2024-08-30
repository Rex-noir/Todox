import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import { ViewTodoList } from "./ViewTodoList";
import { useEffect, useState } from "react";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { CreateNewTodoList } from "@/components/custom/CreateNewTodolistButton";

export const Todos = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const currentViewProject = useTodoxStore((state) => state.currentViewProject);
  const currentProject = currentViewProject
    ? useTodoxStore.getState().projects[currentViewProject]
    : null;

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="grid h-full min-h-screen gap-4 bg-gray-100 md:grid-cols-[18rem,1fr]">
      <div className="fixed left-0 top-0 hidden h-full bg-slate-200 shadow-lg md:block">
        <LayoutMenu />
      </div>
      <div className="grid h-full grid-rows-[60px,1fr] md:col-start-2 md:grid-rows-1">
        <div className="fixed left-0 right-0 top-0 z-10 bg-white shadow-md md:hidden">
          <MobileHeader
            projectTitle={isScrolled ? currentProject?.title : ""}
          />
        </div>
        <main className="row-start-2 h-full md:row-start-1">
          <div className="min-h-screen w-full rounded-md sm:p-3 md:px-10 lg:p-10 lg:px-32">
            <div className="flex w-full flex-col items-start gap-1 border-b pb-2">
              <h1
                className={`px-2 text-2xl font-semibold transition-opacity duration-300 ease-in-out ${
                  isScrolled ? "opacity-0" : "opacity-100"
                }`}
              >
                {currentProject ? currentProject.title : "All"}
              </h1>
              <CreateNewTodoList />
            </div>
            <ViewTodoList />
          </div>
        </main>
      </div>
    </div>
  );
};
