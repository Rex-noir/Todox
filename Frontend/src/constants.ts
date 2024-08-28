import { ProjectStatus } from "./interfaces/types";

export const STATUS_COLORS: Record<NonNullable<ProjectStatus>, string> = {
  active: "text-green-500",
  archived: "text-gray-500",
  completed: "text-blue-500",
  "in progress": "text-yellow-500",
  "on hold": "text-red-500",
};

export const PREDEFINED_COLORS = [
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Green", value: "#00ff00" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Purple", value: "#800080" },
  { name: "Orange", value: "#ffa500" },
  { name: "Pink", value: "#ffc0cb" },
  { name: "Teal", value: "#008080" },
];