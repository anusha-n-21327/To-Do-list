"use client";

import { Button } from "@/components/ui/button";
import { Trash2, CalendarIcon, Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/types/todo";
import { format, differenceInMinutes } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskIcon } from "./TaskIcon";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) => {
  const getDifficultyBadgeClass = (difficulty: Todo["difficulty"]) => {
    switch (difficulty) {
      case "Very Easy":
        return "bg-sky-500 hover:bg-sky-600";
      case "Easy":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "Medium":
        return "bg-amber-500 hover:bg-amber-600";
      case "Challenging":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Tough":
        return "bg-orange-500 hover:bg-orange-600";
      case "Very Tough":
        return "bg-destructive hover:bg-destructive/90";
      default:
        return "bg-muted hover:bg-muted/90";
    }
  };

  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const isDueSoon = todo.dueDate
    ? differenceInMinutes(new Date(todo.dueDate), new Date()) <= 5
    | false;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-lg"
    >
      <Link to={`/task/${todo.id}`} className="block">
        <div className="p-4 bg-card rounded-lg border border-border space-y-3 hover:bg-muted/50 transition-colors h-full">
          <div className="flex items-start justify-between">
            <div className="flex items-center flex-1 pr-4 space-x-3">
              <TaskIcon
                name={todo.icon}
                className="h-5 w-5 text-muted-foreground"
              />
              <p
                className={cn(
                  "font-medium text-foreground",
                  todo.completed && "text-muted-foreground"
                )}
              >
                {todo.text}
              </p>
            </div>
            <div
              className="flex items-center space-x-2 shrink-0"
              onClick={stopPropagation}
            >
              {todo.completed ? (
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-400"
                >
                  Completed
                </Badge>
              ) : isOverdue ? (
                <Badge
                  variant="outline"
                  className="text-red-400 border-red-400"
                >
                  Overdue
                </Badge>
              ) : (
                onToggle && (
                  <Button
                    size="sm"
                    onClick={() => onToggle(todo.id)}
                    className="bg-success hover:bg-success/90"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )
              )}
              {onEdit && !todo.completed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        disabled={isDueSoon}
                        className="text-muted-foreground hover:text-secondary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {isDueSoon && (
                    <TooltipContent>
                      <p>Cannot edit task within 5 minutes of due time.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(todo.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <Badge
              className={cn(
                "text-white border-none",
                getDifficultyBadgeClass(todo.difficulty)
              )}
            >
              {todo.difficulty}
            </Badge>
            {todo.dueDate && (
              <div
                className={cn(
                  "flex items-center text-xs text-muted-foreground",
                  isOverdue && "text-destructive font-semibold"
                )}
              >
                <CalendarIcon className="h-3 w-3 mr-1.5" />
                {format(new Date(todo.dueDate), "PPP p")}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};