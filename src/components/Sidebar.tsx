import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, List, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface SidebarProps {
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
  { id: "home", label: "Home Page", icon: Home, color: "" },
  { id: "all", label: "All Tasks", icon: List, color: "" },
  {
    id: "present",
    label: "Present Tasks",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-success",
  },
  { id: "missed", label: "Missed", icon: XCircle, color: "text-destructive" },
];

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 10, scale: 1.2 },
};

export const Sidebar = ({ filter, setFilter, counts }: SidebarProps) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-card/50 border-r border-border p-4 rounded-l-lg flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text">
          Todo App
        </h2>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isFilter = item.id !== "home";
          const isActive = isFilter && filter === item.id;

          const buttonContent = (
            <div className="relative z-10 flex items-center w-full">
              <motion.div
                variants={iconVariants}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <item.icon className={cn("mr-3 h-5 w-5", item.color)} />
              </motion.div>
              <span>{item.label}</span>
              {isFilter && (
                <span className="ml-auto text-xs bg-muted/50 text-muted-foreground rounded-full px-2 py-0.5">
                  {counts[item.id as keyof typeof counts]}
                </span>
              )}
            </div>
          );

          const button = (
            <Button
              variant="ghost"
              onClick={isFilter ? () => setFilter(item.id) : undefined}
              className={cn(
                "w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground relative",
                isActive && "text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 bg-muted rounded-md z-0"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
              {buttonContent}
            </Button>
          );

          return (
            <motion.div
              key={item.id}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="w-full"
            >
              {isFilter ? button : <Link to="/">{button}</Link>}
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
};