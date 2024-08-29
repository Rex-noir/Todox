import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import ViewManager from "./ViewManager";

export const Todos = () => {
  return (
    <div className="grid min-h-screen bg-gray-100 md:grid-cols-[18rem,1fr]">
      <div className="fixed left-0 top-0 hidden h-full bg-white shadow-lg md:block md:w-72 lg:w-80">
        <LayoutMenu />
      </div>
      <div className="grid grid-rows-[74px,1fr] md:col-start-2 md:grid-rows-1">
        <div className="fixed left-0 right-0 top-0 z-10 md:hidden">
          <MobileHeader />
        </div>
        <main className="row-start-2 md:row-start-1">
          <ViewManager />
        </main>
      </div>
    </div>
  );
};
