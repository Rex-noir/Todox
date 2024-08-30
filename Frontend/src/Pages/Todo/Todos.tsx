import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import { ViewTodoList } from "./ViewTodoList";

export const Todos = () => {
  return (
    <div className="grid min-h-screen gap-4 bg-gray-100 md:grid-cols-[18rem,1fr]">
      <div className="fixed left-0 top-0 hidden h-full bg-slate-200 shadow-lg md:block">
        <LayoutMenu />
      </div>
      <div className="grid grid-rows-[74px,1fr] md:col-start-2 md:grid-rows-1">
        <div className="fixed left-0 right-0 top-0 z-10 md:hidden">
          <MobileHeader />
        </div>
        <main className="row-start-2 md:row-start-1">
          <div className="h-full w-full rounded-md sm:p-3 md:px-10 lg:p-10 lg:px-32">
            <ViewTodoList />
          </div>
        </main>
      </div>
    </div>
  );
};
