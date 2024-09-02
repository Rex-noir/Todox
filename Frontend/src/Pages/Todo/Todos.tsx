import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Await,
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "react-router-dom";
import { Suspense } from "react";
import { LuPanelLeft } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cx } from "class-variance-authority";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import Splash from "../Splash";
import LargeScreenMenu from "./LargeScreenMenu";
import MenuToggleButton from "@/components/MenuToggleButton";
import LogoutButton from "@/components/custom/LogoutButton";

const SideMenu: React.FC<{ isOpen: boolean; toggleMenu: () => void }> = ({
  isOpen,
  toggleMenu,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-20 h-full w-80 bg-white md:w-[20rem]"
      >
        <Button
          onClick={toggleMenu}
          className="absolute right-2 top-2"
          variant="ghost"
        >
          <LuPanelLeft size={24} />
        </Button>
        <LargeScreenMenu />
      </motion.aside>
    )}
  </AnimatePresence>
);

const Header: React.FC<{
  isScrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}> = ({ isScrolled, isMenuOpen, toggleMenu }) => {
  const { projectId } = useParams();
  const location = useLocation();
  const getTitle = () => {
    if (projectId) {
      const project = useTodoxStore.getState().projects[projectId];
      return project ? project.title : "Unknown Project";
    }
    return location.pathname.split("/app/")[1];
  };

  return (
    <header
      className={cx(
        "fixed z-40 flex items-center p-2 transition-all duration-300",
        {
          "bg-white shadow-sm": isScrolled,
          "w-full": !isMenuOpen,
          "w-[calc(100%-20rem)]": isMenuOpen,
        },
      )}
    >
      {!isMenuOpen && (
        <MenuToggleButton isOpen={isMenuOpen} onClick={toggleMenu} />
      )}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isScrolled ? 0 : 50, opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="truncate text-ellipsis text-xl font-bold md:mx-auto"
      >
        {getTitle()}
      </motion.h1>
      <LogoutButton/>
    </header>
  );
};

const ResponsiveLayout: React.FC = () => {
  const { authStatus } = useLoaderData() as { authStatus: boolean };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Suspense fallback={<Splash />}>
      <Await resolve={authStatus} errorElement={<Navigate to="/auth/login" />}>
        {() => (
          <div className="flex min-h-screen">
            <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            <div className="relative flex-1">
              <div className={cx({ "ml-[20rem]": isMenuOpen })}>
                <Header
                  isScrolled={isScrolled}
                  isMenuOpen={isMenuOpen}
                  toggleMenu={toggleMenu}
                />
              </div>
              <main
                className={cx(
                  "mt-14 flex min-h-screen justify-center p-4 transition-all duration-300",
                  {
                    "md:ml-[20rem]": isMenuOpen,
                  },
                )}
              >
                <Outlet />
              </main>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
};
export default ResponsiveLayout;
