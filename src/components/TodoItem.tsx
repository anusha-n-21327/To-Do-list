"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const getDifficultyBadgeClass = (difficulty: Todo["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600 hover:bg-green-700";
      case "Medium":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "Tough":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
      <div className="flex items-start">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="mr-4 mt-1"
        />
        <div className="flex-1">
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "font-medium text-slate-100 cursor-pointer",
              todo.completed && "line-through text-slate-500"
            )}
          >
            {todo.text}
          </label>
          {todo.description && (
            <p
              className={cn(
                "text-sm text-slate-400",
                todo.completed && "line-through"
              )}
            >
              {todo.description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="text-slate-400 hover:text-red-500 hover:bg-slate-700 ml-2 shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Badge
          className={cn(
            "text-white border-none",
            getDifficultyBadgeClass(todo.difficulty)
          )}
        >
          {todo.difficulty}
        </Badge>
      </div>
    </div>
  );
};