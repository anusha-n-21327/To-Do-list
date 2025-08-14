"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center p-4 bg-slate-800 rounded-lg border border-slate-700">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mr-4"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          "flex-1 text-slate-100 cursor-pointer",
          todo.completed && "line-through text-slate-500"
        )}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="text-slate-400 hover:text-red-500 hover:bg-slate-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};