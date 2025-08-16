import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TodoItem } from "@/components/TodoItem";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showError, showSuccess } from "@/utils/toast";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const isMobile = useIsMobile();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [tasksToImport, setTasksToImport] = useState<Todo[] | null>(null);
  const [taskToImport, setTaskToImport] = useState<Todo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const exportTasks = () => {
    if (todos.length === 0) {
      showError("No tasks to export.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(todos, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "tasks.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Tasks exported successfully!");
  };

  const exportSingleTask = (id: string) => {
    const taskToExport = todos.find((todo) => todo.id === id);
    if (!taskToExport) {
      showError("Task not found.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(taskToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `task-${taskToExport.text.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Task exported successfully!");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const importedData = JSON.parse(text);
          const isSingleTodo = (obj: any): obj is Todo =>
            obj &&
            typeof obj.id === "string" &&
            typeof obj.text === "string" &&
            typeof obj.completed === "boolean";

          if (Array.isArray(importedData)) {
            if (
              importedData.length === 0 ||
              isSingleTodo(importedData[0])
            ) {
              setTasksToImport(importedData as Todo[]);
            } else {
              showError("Invalid JSON format for a task list.");
            }
          } else if (isSingleTodo(importedData)) {
            setTaskToImport(importedData as Todo);
          } else {
            showError(
              "Invalid JSON format. Expected a task or a list of tasks."
            );
          }
        }
      } catch (error) {
        showError("Failed to read or parse the file.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const confirmImport = () => {
    if (tasksToImport) {
      setTodos(tasksToImport);
      setTasksToImport(null);
      showSuccess("Tasks imported successfully!");
    }
  };

  const confirmSingleImport = () => {
    if (taskToImport) {
      if (todos.some((todo) => todo.id === taskToImport.id)) {
        showError("A task with this ID already exists. Cannot import.");
      } else {
        setTodos((prevTodos) => [taskToImport, ...prevTodos]);
        showSuccess("Task imported successfully!");
      }
      setTaskToImport(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
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
      <div className="min-h-screen bg-background text-foreground flex items-start justify-center p-4 pt-8 md:pt-16">
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
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text">
                Your Dashboard
              </h1>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleImportClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={exportTasks}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".json"
                />
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDeleteRequest={setDeletingTaskId}
                      onEdit={() => setEditingTask(todo)}
                      onExport={exportSingleTask}
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
            className={cn(
              "fixed h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50",
              isMobile ? "bottom-24 right-4" : "bottom-8 right-8"
            )}
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
      <AlertDialog
        open={!!deletingTaskId}
        onOpenChange={(open) => !open && setDeletingTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingTaskId) {
                  deleteTodo(deletingTaskId);
                  setDeletingTaskId(null);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!tasksToImport}
        onOpenChange={(open) => !open && setTasksToImport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all your current tasks with the ones from the
              file. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!taskToImport}
        onOpenChange={(open) => !open && setTaskToImport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Single Task?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to import the following task: "{taskToImport?.text}
              ". Do you want to add it to your list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSingleImport}>
              Add Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Index;