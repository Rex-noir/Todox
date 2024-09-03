import { GoKebabHorizontal } from "react-icons/go";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDeleteTodoList } from "@/services/todoListService";
import { TbLoader3 } from "react-icons/tb";

export default function TodoListOptions({ listId }: { listId: string }) {
  const deleteMutation = useDeleteTodoList(listId);

  return (
    <div key={listId} onClick={(e) => e.stopPropagation()}>
      <Popover>
        <PopoverTrigger asChild={true}>
          <span>
            <Button asChild size={"sm"} variant={"ghost"}>
              <GoKebabHorizontal className="size-10 cursor-pointer" />
            </Button>
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-3">
          <div>
            <Button
              onClick={() => deleteMutation.mutate()}
              variant={"destructive"}
              className="w-full gap-2"
              size={"sm"}
            >
              <TrashIcon />
              {deleteMutation.isPending ? (
                <TbLoader3 className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
