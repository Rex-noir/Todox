import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import ViewProject from "./ViewProject";

export const Todos = () => {
  return (
    <div className="h-full min-h-screen gap-3 bg-neutral-100 sm:grid sm:grid-cols-[300px,auto] sm:p-2">
      <LayoutMenu />
      <MobileHeader />
      <ViewProject />
    </div>
  );
};
