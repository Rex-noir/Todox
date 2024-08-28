import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ProjectItems } from "./ProjectItems";
import DefaultMenus from "./DefaultMenus";
import CreateNewProjectButton from "@/components/custom/CreateNewProjectButton";
import { Separator } from "@/components/ui/separator";

export default function LayoutMenu() {
  return (
    <Card className="hidden h-full rounded-md bg-white shadow-lg sm:block">
      <CardHeader className="py-3 pb-2">
        <h3 className="scroll-m-20 px-2 text-2xl font-semibold tracking-tight">
          Private
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <nav className="flex h-full flex-col justify-between space-y-1 overflow-y-auto">
          <DefaultMenus />
          <Separator />
          <ProjectItems />
        </nav>
        <CreateNewProjectButton />
      </CardContent>
    </Card>
  );
}
