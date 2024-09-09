import { useAuthStore } from "@/stores/auth/authStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { LuUser2 } from "react-icons/lu";

export default function SideProfileAvatar() {
  const user = useAuthStore().user;
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="mt-3 flex cursor-pointer items-center gap-2 rounded-md p-1 px-2 text-sm hover:bg-neutral-200 dark:hover:bg-slate-900">
            <Avatar>
              <AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span>{user?.name}</span>
              <span className="text-sm">{user?.email}</span>
            </div>
            <ChevronDownIcon />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-2 ml-2">
          <div className="flex flex-col gap-2">
            <div className="flex cursor-pointer px-3 gap-5 items-center rounded-md p-1 hover:bg-neutral-200  dark:hover:bg-slate-800">
              <LuUser2 />
              <span>Account Setting</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
