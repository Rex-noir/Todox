import LayoutMenu from "./ProjectMenu";
import TodoListLayout from "./TodListLayout";

export const Todos = () => {
  return (
    <div className="grid min-h-screen gap-3 bg-neutral-100 p-2 md:grid-cols-[300px,auto]">
      <LayoutMenu />
      <TodoListLayout />
    </div>
  );
};
