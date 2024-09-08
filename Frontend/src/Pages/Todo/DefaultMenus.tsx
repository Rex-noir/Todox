import React from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { TbCalendar } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { GoCalendar } from "react-icons/go";

interface MenuItem {
  name: string;
  color: string;
  icon: IconType;
  url: string;
}

const defaultMenus: MenuItem[] = [
  {
    name: "Today",
    color: "text-green-500",
    icon: TbCalendar,
    url: "/app/today",
  },
  {
    name: "Upcoming",
    color: "text-red-500",
    icon: GoCalendar,
    url: "/app/upcoming",
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

const MenuItem: React.FC<MenuItem> = ({ name, color, url, icon: Icon }) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `flex w-full items-center justify-start rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-900 ${
          isActive
            ? "bg-gray-100 dark:bg-slate-800"
            : "text-gray-700 dark:text-white"
        }`
      }
    >
      <Icon className={`mr-3 size-5 ${color}`} />
      {name}
    </NavLink>
  );
};

export default DefaultMenus;
