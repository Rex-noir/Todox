import LayoutMenu from "./LayoutMenu";
import TodoListLayout from "./TodListLayout";

export const Todos = () => {
  return (
    <div className="grid md:grid-cols-[300px,auto] min-h-screen p-2 bg-neutral-100 gap-3">
      <LayoutMenu />
      <TodoListLayout />
    </div>
  );
};
