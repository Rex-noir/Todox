import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_COLORS } from "@/constants";
import { Project } from "@/interfaces/types";
import { setCurrentViewProject } from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { TbSquareRounded } from "react-icons/tb";

export function ProjectItems({ closeSheet }: { closeSheet?: () => void }) {
  const projects = useTodoxStore((state) => state.projects);

  return (
    <div className="flex h-full flex-col justify-between space-y-1 overflow-y-auto">
      <h3 className="px-1">Projects</h3>
      {Object.keys(projects).length > 0 ? (
        Object.values(projects).map((project) => (
          <div onClick={closeSheet} key={project.id}>
            <ProjectItem {...project} />
          </div>
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="p-5 text-center text-sm text-gray-500">
            Empty Projects. Create now!
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectItem({ id, title, status, iconColor }: Project) {
  const isActive = useTodoxStore().currentViewProject === id;

  return (
    <Button
      onClick={() => setCurrentViewProject(id)}
      data-testid={`project-item-${id}`}
      variant={"ghost"}
      className={`grid w-full grid-cols-[24px,auto] items-center justify-start gap-2 ${
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-neutral-100"
      }`}
    >
      <div>
        <TbSquareRounded
          className="size-6"
          style={{ color: iconColor || "#000000" }}
        />
      </div>

      <div className="grid w-full grid-cols-[120px,auto] gap-4">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-left">
          {title}
        </span>
        {status && (
          <Badge className="w-fi mx-auto h-fit" variant={"outline"}>
            <span className={`${STATUS_COLORS[status]}`}>{status}</span>
          </Badge>
        )}
      </div>
    </Button>
  );
}
