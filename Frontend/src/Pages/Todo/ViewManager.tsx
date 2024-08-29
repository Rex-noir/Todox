import { useLocation } from "react-router-dom";
import ViewProject from "./ViewProject";
import ViewAll from "./ViewAll";

export default function ViewManager() {
  const location = useLocation().pathname;

  return (
    <div className="h-full rounded-md sm:p-2 w-full sm:pt-10 md:p-3 lg:p-10 lg:px-32">
      {location === "/todos" ? <ViewAll /> : <ViewProject />}
    </div>
  );
}
