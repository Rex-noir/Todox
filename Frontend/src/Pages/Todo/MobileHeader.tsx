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
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MobileHeader({
  projectTitle,
}: {
  projectTitle?: string;
}) {
  const location = useLocation();

  const getRouteTitle = () => {
    const path = location.pathname;
    if (path.includes("/app/today")) return "Today";
    if (path.includes("/app/important")) return "Important";
    if (path.includes("/app/projects")) return "Projects";
    return "All";
  };

  return (
    <div className="flex items-center justify-between bg-neutral-100 p-2">
      <Navigation />
      <div className="truncate text-ellipsis text-lg font-semibold">
        {projectTitle ?? getRouteTitle()}
      </div>
      <Avatar>
        <AvatarFallback className="bg-gray-300">Hi</AvatarFallback>
      </Avatar>
    </div>
  );
}

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <LuPanelLeft className="h-6 w-6 text-gray-600" />
      </SheetTrigger>
      <SheetContent side={"left"} className="w-full max-w-xs">
        <SheetTitle className="text-2xl font-semibold">Private</SheetTitle>
        <SheetDescription />
        <div className="mt-6 flex h-fit flex-col gap-6">
          <DefaultMenus closeSheet={() => setOpen(false)} />
          <Separator />
          <ProjectItems closeSheet={() => setOpen(false)} />
          <CreateNewProjectButton />
        </div>
      </SheetContent>
    </Sheet>
  );
};
