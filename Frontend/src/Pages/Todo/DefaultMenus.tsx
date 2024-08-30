import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { setCurrentViewProject } from "@/stores/todox/actions";
import { IconType } from "react-icons";
import { TbList, TbCalendar, TbStar } from "react-icons/tb";

interface MenuItem {
  name: string;
  color: string;
  onClick: () => void;
  icon: IconType;
}

const defaultMenus: MenuItem[] = [
  {
    name: "All",
    color: "text-blue-500",
    onClick: () => setCurrentViewProject(null),
    icon: TbList,
  },
  {
    name: "Today",
    color: "text-green-500",
    onClick: () => console.log("Today clicked"),
    icon: TbCalendar,
  },
  {
    name: "Important",
    color: "text-yellow-500",
    onClick: () => console.log("Important clicked"),
    icon: TbStar,
  },
] as const;

interface DefaultMenusProps {
  closeSheet?: () => void;
}

const DefaultMenus: React.FC<DefaultMenusProps> = ({ closeSheet }) => {
  return (
    <div className="flex flex-col gap-3">
      {defaultMenus.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          onClick={closeSheet}
        >
          <MenuItem {...item} />
        </motion.div>
      ))}
    </div>
  );
};

const MenuItem: React.FC<MenuItem> = ({ name, color, onClick, icon: Icon }) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex w-full items-center justify-start rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
    >
      <Icon className={`mr-3 size-5 ${color}`} />
      {name}
    </Button>
  );
};

export default DefaultMenus;
