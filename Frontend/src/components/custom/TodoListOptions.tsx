import { GoKebabHorizontal } from "react-icons/go";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDeleteTodoList } from "@/services/todoListService";
import { TbLoader3 } from "react-icons/tb";

export default function TodoListOptions({ listId }: { listId: string }) {
  const deleteMutation = useDeleteTodoList(listId);

  return (
    <Popover>
      <PopoverTrigger>
        <Button size={"sm"} variant={"ghost"}>
          <GoKebabHorizontal className="size-5 cursor-pointer" />
        </Button>
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
  );
}
