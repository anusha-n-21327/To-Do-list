import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";

export const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Customize theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Colorful Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blue-dark")}>
          Ocean Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("purple-dark")}>
          Violet Night
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green-dark")}>
          Forest Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset-dark")}>
          Sunset
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("aurora-dark")}>
          Aurora
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};