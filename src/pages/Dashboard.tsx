import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TodoItem } from "@/components/TodoItem";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import {
  getCompletedTasks,
  getMissedTasks,
  getActiveTasks,
} from "@/utils/task-categorizer";
import { motion, AnimatePresence } from "framer-motion";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { getIconForTask } from "@/utils/icon-mapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNavBar } from "@/components/BottomNavBar";
import { cn } from "@/lib/utils";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem("todos");
        const parsedTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];

        let needsUpdate = false;
        const migratedTodos = parsedTodos.map((todo) => {
          if (!todo.icon) {
            needsUpdate = true;
            return {
              ...todo,
              icon: getIconForTask(todo.text, todo.description),
            };
          }
          return todo;
        });

        if (needsUpdate) {
          localStorage.setItem("todos", JSON.stringify(migratedTodos));
        }

        setTodos(migratedTodos);
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full flex",
            isMobile ? "flex-col max-w-lg h-full" : "max-w-4xl h-[80vh]"
          )}
        >
          {!isMobile && (
            <Sidebar filter={filter} setFilter={setFilter} counts={counts} />
          )}
          <main
            className={cn(
              "flex-1 bg-card/30 p-6 overflow-y-auto",
              isMobile ? "rounded-lg pb-24" : "rounded-r-lg"
            )}
          >
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text mb-6">
              Your Dashboard
            </h1>
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
                    className="flex items-center justify-center h-full py-20"
                  >
                    <p className="text-center text-muted-foreground">
                      No tasks in this category.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
          {isMobile && (
            <BottomNavBar
              filter={filter}
              setFilter={setFilter}
              counts={counts}
            />
          )}
        </div>

        <Link to="/add-task">
          <Button
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-40"
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

        {!isMobile && (
          <div className="absolute bottom-0">
            <Footer />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Index;