import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Import dropdown menu components

import { PREDEFINED_COLORS } from "@/constants";

export const ColorPicker = ({
  onChange,
}: {
  onChange: (color: string) => void;
}) => {
  const [color, setColor] = useState(PREDEFINED_COLORS[0].value);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          title="Add custom color"
          variant={"outline"}
          style={{ borderColor: color }}
          className="flex h-8 w-8 items-center justify-center p-0"
        >
          <PlusIcon width={16} height={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col items-center gap-1">
        {/* Color Picker */}
        <HexColorPicker
          className="w-full"
          color={color}
          onChange={handleColorChange}
        />

        {/* Display Selected Color Text */}
        <div>
          <p className="text-xs font-medium">{color.toUpperCase()}</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
