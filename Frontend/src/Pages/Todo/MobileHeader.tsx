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
    <div className="flex items-center justify-between border-b p-2 sm:hidden">
      <div>
        <Navigation />
      </div>
      <div>Project</div>
      <div>
        <Avatar>
          <AvatarFallback className="bg-neutral-300">hi</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export const Navigation = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <LuPanelLeft className="size-7" />
      </SheetTrigger>
      <SheetContent side={"left"} className="w-full">
        <SheetTitle className="mt-4">
          <div className="flex flex-col gap-3">
            <p>Private</p>
            <DefaultMenus />
          </div>
        </SheetTitle>
        <SheetDescription asChild className="mt-2">
          <Separator />
        </SheetDescription>
        <div className="mt-3 flex flex-col gap-3">
          <ProjectItems />
          <CreateNewProjectButton />
        </div>
      </SheetContent>
    </Sheet>
  );
};
