import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { TbSquareRounded } from "react-icons/tb";
import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  link: string;
  color: string;
}

const defaultMenus: MenuItem[] = [
  { name: "All", link: "/todos", color: "text-blue-500" },
] as const;

export default function LayoutMenu() {
  return (
    <Card className="h-full bg-white rounded-md shadow-lg">
      <CardHeader className="py-3 pb-2">
        <h3 className="scroll-m-20 px-2 text-2xl font-semibold tracking-tight">
          Private
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <nav className="flex flex-col space-y-1 h-72 overflow-y-auto">
          {defaultMenus.map((item) => (
            <MenuItem key={item.name} {...item} />
          ))}
        </nav>

        <Button
          className="justify-start w-full rounded-xl py-5 text-green-500 hover:bg-neutral-50"
          variant={"secondary"}
        >
          <PlusCircledIcon className="size-5 mr-3 font-bold " />
          <span>Create new project</span>
        </Button>
      </CardContent>
      <Separator />
      <CardHeader className="pt-2">
        <h3 className="scroll-m-20  px-2 text-2xl font-semibold tracking-tight">
          Team
        </h3>
      </CardHeader>
      <CardContent className="text-center space-x-4 text-neutral-600">Coming soon!</CardContent>
    </Card>
  );
}

export function MenuItem({ link, name, color }: MenuItem) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-300"
        }`
      }
    >
      <TbSquareRounded className={`size-6 mr-3 ${color}`} />
      {name}
    </NavLink>
  );
}
