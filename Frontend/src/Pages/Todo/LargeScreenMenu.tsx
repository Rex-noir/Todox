import React from "react";
import { motion } from "framer-motion";
import { ProjectItems } from "./ProjectItems";
import DefaultMenus from "./DefaultMenus";
import CreateNewProjectButton from "@/components/custom/CreateNewProjectButton";
import { Separator } from "@/components/ui/separator";

const LayoutMenu: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto bg-white p-6 shadow-lg"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8 text-3xl font-bold tracking-tight text-gray-900"
      >
        Private
      </motion.h3>
      <nav className="flex flex-col gap-8">
        <DefaultMenus />
        <Separator className="bg-gray-200" />
        <ProjectItems />
        <CreateNewProjectButton />
      </nav>
    </motion.div>
  );
};

export default LayoutMenu;
