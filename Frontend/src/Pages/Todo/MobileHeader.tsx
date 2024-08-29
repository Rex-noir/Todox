import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LuPanelLeft } from "react-icons/lu";
import DefaultMenus from "./DefaultMenus";
import { ProjectItems } from "./ProjectItems";
import { Separator } from "@/components/ui/separator";
import CreateNewProjectButton from "@/components/custom/CreateNewProjectButton";

export default function MobileHeader() {
  return (
    <div className="flex items-center justify-between bg-neutral-100 p-4 shadow-sm">
      <Navigation />
      <div className="text-lg font-semibold">All</div>
      <Avatar>
        <AvatarFallback className="bg-gray-300">Hi</AvatarFallback>
      </Avatar>
    </div>
  );
}

export const Navigation = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <LuPanelLeft className="h-6 w-6 text-gray-600" />
      </SheetTrigger>
      <SheetContent side={"left"} className="w-full max-w-xs">
        <SheetTitle className="text-2xl font-semibold">Private</SheetTitle>
        <SheetDescription asChild>
          <div className="mt-6 flex flex-col gap-6">
            <DefaultMenus />
            <Separator />
            <ProjectItems />
            <CreateNewProjectButton />
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};
