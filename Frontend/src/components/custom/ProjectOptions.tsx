import { GoKebabHorizontal } from "react-icons/go";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDeleteProject } from "@/services/projectService";
import { TbLoader3 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function ProjectOptions({ projectId }: { projectId: string }) {
  const deleteMutation = useDeleteProject(projectId);
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/app/today");
      },
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            size={"sm"}
            variant={"ghost"}
          >
            <GoKebabHorizontal className="size-5 cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-2 w-[150px] p-2">
          <Button
            onClick={handleDelete}
            size={"sm"}
            variant={"destructive"}
            className="w-full gap-2"
          >
            {deleteMutation.isPending ? (
              <TbLoader3 className="animate-spin" />
            ) : (
              <>
                <TrashIcon />
                Delete Project
              </>
            )}
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
