import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Todo } from "@/types/todo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { TaskIcon } from "@/components/TaskIcon";

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Todo | null>(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const todos: Todo[] = JSON.parse(savedTodos);
      const currentTask = todos.find((todo) => todo.id === id);
      setTask(currentTask || null);
    }
  }, [id]);

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

  if (!task) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Task not found.</p>
        <Link to="/dashboard">
          <Button variant="link">Go back</Button>
        </Link>
      </div>
    );
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-4 self-start">
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="bg-transparent border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Task List
            </Button>
          </Link>
        </div>
        <Card className="w-full bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TaskIcon name={task.icon} className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text">
                {task.text}
              </CardTitle>
            </div>
            {task.completed && (
              <CardDescription className="text-green-400 mt-2">
                Completed
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Difficulty
                </h3>
                <Badge
                  className={cn(
                    "border-none text-base px-4 py-2",
                    getDifficultyBadgeClass(task.difficulty)
                  )}
                >
                  {task.difficulty}
                </Badge>
              </div>
              {task.dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Due Date
                  </h3>
                  <div
                    className={cn(
                      "flex items-center text-foreground",
                      isOverdue && "text-destructive font-semibold"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(new Date(task.dueDate), "PPP p")}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default TaskDetails;