import { useState, useEffect } from "react";
import MobileHeader from "./MobileHeader";
import LayoutMenu from "./LargeScreenMenu";
import ViewManager from "./ViewManager";

export const Todos = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg">
          <LayoutMenu />
        </div>
      )}
      <div className={`flex-1 ${!isMobile ? "ml-80" : ""}`}>
        {isMobile && (
          <div className="fixed left-0 right-0 top-0 z-10">
            <MobileHeader />
          </div>
        )}
        <main className={`${isMobile ? "mt-16" : ""}`}>
          <ViewManager />
        </main>
      </div>
    </div>
  );
};
