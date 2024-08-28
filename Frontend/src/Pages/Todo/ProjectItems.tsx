import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/constants";
import { Project } from "@/interfaces/types";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { TbSquareRounded } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export function ProjectItems() {
  const projects = useTodoxStore((state) => state.projects);

  return (
    <div className="flex h-full flex-col justify-between space-y-1 overflow-y-auto">
      <h3 className="px-1">Projects</h3>
      {Object.keys(projects).length > 0 ? (
        Object.values(projects).map((project) => (
          <ProjectItem key={project.id} {...project} />
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm p-5 text-gray-500">
            Empty Projects. Create now!
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectItem({ id, title, status, iconColor }: Project) {
  return (
    <NavLink
      data-testid={`project-item-${id}`}
      to={`/project/${id}`}
      className={({ isActive }) =>
        `flex items-center rounded-md px-4 py-2 text-sm transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-neutral-100"
        }`
      }
    >
      <TbSquareRounded
        className={`mr-3 size-7`}
        style={{ color: iconColor || "#000000" }}
      />
      <div className="flex w-full justify-between">
        <span>{title}</span>
        {status && (
          <Badge variant={"outline"}>
            <span className={`${STATUS_COLORS[status]}`}>{status}</span>
          </Badge>
        )}
      </div>
    </NavLink>
  );
}
