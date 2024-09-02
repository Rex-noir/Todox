import { useDeleteTodo } from "@/services/todoService";
import { Button } from "../ui/button";
import { TbLoader3 } from "react-icons/tb";

export default function DeleteTodoButton({ todoId }: { todoId: string }) {
  const deleteTodo = useDeleteTodo(todoId);
  const handleDelete = () => {
    deleteTodo.mutate();
  };
  return (
    <Button onClick={handleDelete} className="text-gray-600" variant={"link"}>
      {deleteTodo.isPending && <TbLoader3 className="animate-spin" />}
      {deleteTodo.isIdle && "Delete"}
    </Button>
  );
}
