import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, List } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  counts: {
    all: number;
    present: number;
    completed: number;
    missed: number;
  };
}

const navItems = [
  { id: "all", label: "All", icon: List, color: "" },
  { id: "present", label: "Present", icon: Clock, color: "text-yellow-500" },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-success",
  },
  { id: "missed", label: "Missed", icon: XCircle, color: "text-destructive" },
];

export const BottomNavBar = ({
  filter,
  setFilter,
  counts,
}: BottomNavBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setFilter(item.id)}
            className={cn(
              "flex flex-col items-center h-16 w-full rounded-none relative text-muted-foreground",
              filter === item.id && "text-primary"
            )}
          >
            {filter === item.id && (
              <motion.div
                layoutId="active-mobile-indicator"
                className="absolute top-0 h-1 w-12 bg-primary rounded-b-full"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
            <div className="relative">
              <item.icon
                className={cn(
                  "h-6 w-6",
                  filter !== item.id ? item.color : ""
                )}
              />
              <span className="absolute -top-1 -right-2 text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                {counts[item.id as keyof typeof counts]}
              </span>
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};