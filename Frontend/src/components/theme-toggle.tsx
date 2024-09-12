import { useTheme } from "./theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme.toString()} onValueChange={setTheme}>
      <SelectTrigger>
        <SelectValue placeholder={theme.toString()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}
