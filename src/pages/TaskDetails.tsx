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
import { MorphingOverlay } from "@/components/MorphingOverlay";

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

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Task not found.</p>
        <Link to="/">
          <Button variant="link">Go back</Button>
        </Link>
      </div>
    );
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5, // Delay content animation until overlay is revealing
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.2 } }}>
      <MorphingOverlay />
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-4 self-start">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-transparent border-slate-600 hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Task List
              </Button>
            </Link>
          </div>
          <Card className="w-full bg-slate-800/50 border-slate-700">
            <motion.div
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-cyan-500 text-transparent bg-clip-text">
                    {task.text}
                  </CardTitle>
                  {task.completed && (
                    <CardDescription className="text-green-400">
                      Completed
                    </CardDescription>
                  )}
                </CardHeader>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardContent className="space-y-6">
                  {task.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">
                        Description
                      </h3>
                      <p className="text-slate-400 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div>
                      <h3 className="text-sm font-medium text-slate-300 mb-2">
                        Difficulty
                      </h3>
                      <Badge
                        className={cn(
                          "text-white border-none text-base px-4 py-2",
                          getDifficultyBadge-class(task.difficulty)
                        )}
                      >
                        {task.difficulty}
                      </Badge>
                    </div>
                    {task.dueDate && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-300 mb-2">
                          Due Date
                        </h3>
                        <div
                          className={cn(
                            "flex items-center text-slate-300",
                            isOverdue && "text-red-400 font-semibold"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {format(new Date(task.dueDate), "PPP p")}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            </motion.div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetails;