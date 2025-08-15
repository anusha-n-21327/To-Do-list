import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, List } from "lucide-react";
import { motion } from "framer-motion";

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
  { id: "all", label: "All Tasks", icon: List },
  { id: "present", label: "Present Tasks", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle },
  { id: "missed", label: "Missed", icon: XCircle },
];

export const Sidebar = ({ filter, setFilter, counts }: SidebarProps) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-card/50 border-r border-border p-4 rounded-l-lg flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text">
          Todo App
        </h2>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setFilter(item.id)}
            className={cn(
              "w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground relative",
              filter === item.id && "text-foreground"
            )}
          >
            {filter === item.id && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-muted rounded-md z-0"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
            <div className="relative z-10 flex items-center w-full">
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
              <span className="ml-auto text-xs bg-muted/50 text-muted-foreground rounded-full px-2 py-0.5">
                {counts[item.id as keyof typeof counts]}
              </span>
            </div>
          </Button>
        ))}
      </nav>
    </aside>
  );
};