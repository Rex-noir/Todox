import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  // Define the color gradients for both light and dark mode
  const lightModeGradients = [
    "from-blue-500 to-purple-500",
    "from-green-500 to-blue-500",
    "from-red-500 to-yellow-500",
    "from-pink-500 to-orange-500",
  ];

  const darkModeGradients = [
    "from-blue-700 to-purple-700",
    "from-green-700 to-blue-700",
    "from-red-700 to-yellow-700",
    "from-pink-700 to-orange-700",
  ];

  // Use Tailwind's dark class detection
  const isDarkMode = useTheme().theme === "dark";
  const gradients = isDarkMode ? darkModeGradients : lightModeGradients;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setColorIndex((prevIndex) => (prevIndex + 1) % gradients.length);
          return 0; // Reset progress
        }
        return prevProgress + 1; // Increase progress
      });
    }, 5); // Adjust this interval to control speed (increased to 5ms to be smoother)

    return () => clearInterval(interval);
  }, [gradients.length]);

  return (
    <div className="fixed top-0 mb-6 h-px w-full dark:bg-neutral-700">
      <div
        className={`h-[2px] animate-pulse bg-gradient-to-r ${gradients[colorIndex]}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
