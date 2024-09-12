import { useState } from "react";
import { LuSettings2, LuUser2, LuPanelLeft } from "react-icons/lu";
import { Cross1Icon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AccountView from "@/components/custom/settings/AccountSetting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import PreferencesSetting from "@/components/custom/settings/PreferencesSetting";
import { MdRoomPreferences } from "react-icons/md";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  view: React.ReactNode;
  id: string;
}

const items: MenuItem[] = [
  {
    id: "account",
    title: "Account",
    icon: <LuUser2 />,
    view: <AccountView />,
  },
  {
    id: "preferences",
    title: "Preferences",
    icon: <MdRoomPreferences />,
    view: <PreferencesSetting />,
  },
];

export default function Settings() {
  const [currentView, setCurrentView] = useState<string>(items[0].id);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderView = () => {
    const item = items.find((item) => item.id === currentView);
    return item ? item.view : null;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="flex cursor-pointer items-center gap-5 rounded-md p-1 px-3 hover:bg-neutral-200 dark:hover:bg-slate-800">
            <LuSettings2 />
            <span>Settings</span>
          </div>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide h-screen max-w-3xl overflow-y-scroll p-0 md:h-fit">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle />
              <DialogDescription />
            </DialogHeader>
          </VisuallyHidden>

          {/* Mobile Layout (Slide Navigation) */}
          {!isDesktop && (
            <div className="block">
              <div className="bg-gray flex items-center justify-between border-b p-2 px-3">
                <div className="flex h-fit items-center gap-px">
                  <div className="flex items-center">
                    <SlideNav
                      currentView={currentView}
                      setCurrentView={setCurrentView}
                    />
                  </div>
                  <div className="p-2">{currentView.toUpperCase()}</div>
                </div>
                <div>
                  <Cross1Icon
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>
              <div className="py-1">{renderView()}</div>
            </div>
          )}

          {/* Large Screen Layout (Grid) */}
          {isDesktop && (
            <div className="grid h-full grid-cols-[250px,1fr] gap-3">
              <div className="col-start-1 bg-slate-100 dark:bg-slate-900">
                <MenuItems
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                />
              </div>
              <div className="col-start-2 flex flex-col gap-3">
                <div className="flex justify-between border-b py-3">
                  <span>{currentView.toUpperCase()}</span>
                  <Cross1Icon
                    className="mr-3 size-5 cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <ScrollArea className="h-[500px]">{renderView()}</ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MenuItems({
  currentView,
  setCurrentView,
}: {
  currentView: string;
  setCurrentView: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-2 bg-inherit p-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex cursor-pointer items-center gap-1 rounded-md text-sm ${
            currentView === item.id
              ? "bg-neutral-200 dark:bg-slate-950"
              : "hover:bg-neutral-100 dark:hover:bg-slate-800"
          }`}
          onClick={() => setCurrentView(item.id)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            {item.icon}
          </div>
          <div>{item.title}</div>
        </div>
      ))}
    </div>
  );
}

function SlideNav({
  currentView,
  setCurrentView,
}: {
  currentView: string;
  setCurrentView: (id: string) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <LuPanelLeft className="size-5 cursor-pointer" />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="w-full bg-slate-100 p-2 py-10 dark:bg-slate-900"
      >
        <VisuallyHidden>
          <SheetTitle />
          <SheetDescription />
        </VisuallyHidden>
        <MenuItems currentView={currentView} setCurrentView={setCurrentView} />
      </SheetContent>
    </Sheet>
  );
}
