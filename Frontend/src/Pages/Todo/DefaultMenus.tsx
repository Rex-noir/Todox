import { TbSquareRounded } from "react-icons/tb";
import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  link: string;
  color: string;
}

const defaultMenus: MenuItem[] = [
  { name: "All", link: "/todos", color: "text-blue-500" },
] as const;
export default function DefaultMenus() {
  return (
    <>
      {defaultMenus.map((item) => (
        <MenuItem key={item.name} {...item} />
      ))}
    </>
  );
}

function MenuItem({ link, name, color }: MenuItem) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex items-center rounded-md px-4 py-2 text-sm transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-300"
        }`
      }
    >
      <TbSquareRounded className={`mr-3 size-6 ${color}`} />
      {name}
    </NavLink>
  );
}
