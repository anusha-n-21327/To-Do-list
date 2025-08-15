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
  getActiveTasks,
} from "@/utils/task-categorizer";
import { motion, AnimatePresence } from "framer-motion";
import { EditTaskDialog } from "@/components/EditTaskDialog";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Todo | null>(null);

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

  const updateTodo = (updatedTask: Todo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo))
    );
    setEditingTask(null);
  };

  const activeTasks = getActiveTasks(todos);
  const completedTasks = getCompletedTasks(todos);
  const missedTasks = getMissedTasks(todos);

  const getFilteredTodos = () => {
    switch (filter) {
      case "present":
        return activeTasks;
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
    present: activeTasks.length,
    completed: completedTasks.length,
    missed: missedTasks.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh] flex">
          <Sidebar filter={filter} setFilter={setFilter} counts={counts} />
          <main className="flex-1 bg-slate-800/30 p-6 rounded-r-lg overflow-y-auto">
            <div className="space-y-4">
              <AnimatePresence>
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={() => setEditingTask(todo)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full"
                  >
                    <p className="text-center text-slate-500">
                      No tasks in this category.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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

        <EditTaskDialog
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          onSave={updateTodo}
        />

        <div className="absolute bottom-0">
          <MadeWithDyad />
        </div>
      </div>
    </motion.div>
  );
};

export default Index;