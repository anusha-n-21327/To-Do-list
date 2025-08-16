"use client";

import { Button } from "@/components/ui/button";
import { Trash2, CalendarIcon, Check, Edit, Download } from "lucide-react";
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
  onDeleteRequest?: (id: string) => void;
  onEdit?: () => void;
  onExport?: (id: string) => void;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDeleteRequest,
  onEdit,
  onExport,
}: TodoItemProps) => {
  const getDifficultyBadgeClass = (difficulty: Todo["difficulty"]) => {
    switch (difficulty) {
      case "Very Easy":
        return "bg-gradient-to-r from-sky-400 to-cyan-300 text-sky-900 font-semibold";
      case "Easy":
        return "bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-900 font-semibold";
      case "Challenging":
        return "bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 font-semibold";
      case "Tough":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "Difficult":
        return "bg-gradient-to-r from-red-600 to-rose-600 text-white";
      case "Very Tough":
        return "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white";
      default:
        return "bg-muted";
    }
  };

  const isOverdue =
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const isDueSoon = todo.dueDate
    ? differenceInMinutes(new Date(todo.dueDate), new Date()) <= 5
    : false;

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
              {onExport && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        stopPropagation(e);
                        onExport(todo.id);
                      }}
                      className="text-muted-foreground hover:text-primary hover:bg-muted"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Task</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {onDeleteRequest && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRequest(todo.id)}
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
                "border-none",
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