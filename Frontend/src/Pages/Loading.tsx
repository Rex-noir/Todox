import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  // Define the color gradients
  const gradients = [
    "from-blue-700 to-purple-700",
    "from-green-700 to-blue-700",
    "from-red-700 to-yellow-700",
    "from-pink-700 to-orange-700",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setColorIndex((prevIndex) => (prevIndex + 1) % gradients.length);
          return 0; // Reset progress
        }
        return prevProgress + 1; // Increase progress
      });
    }, 0.5); // Adjust this interval to control speed

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
