import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TodoItem } from "@/components/TodoItem";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Sidebar } from "@/components/Sidebar";
import {
  getCompletedTasks,
  getMissedTasks,
  getPendingTasks,
} from "@/utils/task-categorizer";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem("todos");
        setTodos(savedTodos ? JSON.parse(savedTodos) : []);
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
        setTodos([]);
      }
    };

    loadTodos();
    window.addEventListener("focus", loadTodos);
    return () => {
      window.removeEventListener("focus", loadTodos);
    };
  }, []);

  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem("todos") !== null) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const pendingTasks = getPendingTasks(todos);
  const completedTasks = getCompletedTasks(todos);
  const missedTasks = getMissedTasks(todos);

  const getFilteredTodos = () => {
    switch (filter) {
      case "pending":
        return pendingTasks;
      case "completed":
        return completedTasks;
      case "missed":
        return missedTasks;
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  const counts = {
    all: todos.length,
    pending: pendingTasks.length,
    completed: completedTasks.length,
    missed: missedTasks.length,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] flex">
        <Sidebar filter={filter} setFilter={setFilter} counts={counts} />
        <main className="flex-1 bg-slate-800/30 p-6 rounded-r-lg overflow-y-auto">
          <div className="space-y-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-slate-500">
                  No tasks in this category.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Link to="/add-task">
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg"
          size="icon"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </Link>

      <div className="absolute bottom-0">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;