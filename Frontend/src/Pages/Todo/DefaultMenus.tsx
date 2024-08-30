import { Button } from "@/components/ui/button";
import { setCurrentViewProject } from "@/stores/todox/actions";
import { TbSquareRounded } from "react-icons/tb";

interface MenuItem {
  name: string;
  link?: string;
  color: string;
  onClick: () => void;
}

const defaultMenus: MenuItem[] = [
  {
    name: "All",
    color: "text-blue-500",
    onClick: () => setCurrentViewProject(null),
  },
] as const;
export default function DefaultMenus() {
  return (
    <>
      {defaultMenus.map((item) => (
        <MenuItem key={item.name} {...item} />
      ))}
    </>
  );
}

function MenuItem({ name, color, onClick }: MenuItem) {
  return (
    <Button
      variant={"ghost"}
      onClick={() => onClick()}
      className={`: "text-gray-600 flex items-center justify-start rounded-md px-4 py-2 text-sm transition-colors duration-150 ease-in-out hover:bg-neutral-200`}
    >
      <TbSquareRounded className={`mr-3 size-6 ${color}`} />
      {name}
    </Button>
  );
}
