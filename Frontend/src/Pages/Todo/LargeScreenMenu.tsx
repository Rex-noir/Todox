import { ProjectItems } from "./ProjectItems";
import DefaultMenus from "./DefaultMenus";
import CreateNewProjectButton from "@/components/custom/CreateNewProjectButton";
import { Separator } from "@/components/ui/separator";

export default function LayoutMenu() {
  return (
    <div className="h-full overflow-y-auto bg-white p-4">
      <h3 className="mb-6 text-2xl font-semibold tracking-tight">Private</h3>
      <nav className="flex flex-col gap-6">
        <DefaultMenus />
        <Separator />
        <ProjectItems />
        <CreateNewProjectButton />
      </nav>
    </div>
  );
}
