import React from "react";
import { Button } from "@/components/ui/button";
import { LuPanelLeft, LuPanelRightClose } from "react-icons/lu";

interface MenuToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({
  isOpen,
  onClick,
}) => (
  <Button onClick={onClick} variant="ghost">
    {isOpen ? <LuPanelRightClose size={24} /> : <LuPanelLeft size={24} />}
  </Button>
);

export default MenuToggleButton;
