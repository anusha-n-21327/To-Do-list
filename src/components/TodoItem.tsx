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
        return "bg-sky-600 hover:bg-sky-700";
      case "Easy":
        return "bg-green-600 hover:bg-green-700";
      case "Medium":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "Tough":
        return "bg-orange-600 hover:bg-orange-700";
      case "Very Tough":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-600 hover:bg-slate-700";
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
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 hover:bg-slate-700/50 transition-colors h-full">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <p
                className={cn(
                  "font-medium text-slate-100",
                  todo.completed && "text-slate-500"
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
              ) : (
                onToggle &&
                (isOverdue ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 w-full"
                          disabled
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This task is overdue and cannot be submitted.</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onToggle(todo.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                ))
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
                        className="text-slate-400 hover:text-blue-500 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="text-slate-400 hover:text-red-500 hover:bg-slate-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
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
                  "flex items-center text-xs text-slate-400",
                  isOverdue && "text-red-400 font-semibold"
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