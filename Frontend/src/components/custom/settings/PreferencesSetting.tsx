import { ToggleTheme } from "@/components/theme-toggle";

export default function PreferencesSetting() {
  return (
    <div className="flex flex-col p-2">
      <div>
        <p>Theme</p>
        <ToggleTheme />
      </div>
    </div>
  );
}
