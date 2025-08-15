import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Todo } from "@/types/todo";
import { ArrowLeft } from "lucide-react";
import { analyzeDifficulty } from "@/utils/difficulty-analyzer";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/DateTimePicker";
import { motion } from "framer-motion";

const AddTaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title;

  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<
    "Very Easy" | "Easy" | "Medium" | "Tough" | "Very Tough"
  >("Medium");
  const [dueDate, setDueDate] = useState<Date>();

  useEffect(() => {
    if (!title) {
      navigate("/add-task");
    }
  }, [title, navigate]);

  useEffect(() => {
    if (title) {
      const determinedDifficulty = analyzeDifficulty(title, description);
      setDifficulty(determinedDifficulty);
    }
  }, [title, description]);

  const handleSave = () => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: title,
      description,
      completed: false,
      difficulty,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };

    try {
      const savedTodos = localStorage.getItem("todos");
      const todos = savedTodos ? JSON.parse(savedTodos) : [];
      const updatedTodos = [newTodo, ...todos];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      navigate("/");
    } catch (error) {
      console.error("Failed to save todo to localStorage", error);
    }
  };

  const getDifficultyBadgeClass = (difficulty: Todo["difficulty"]) => {
    switch (difficulty) {
      case "Very Easy":
        return "bg-sky-500 hover:bg-sky-600";
      case "Easy":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "Medium":
        return "bg-amber-500 hover:bg-amber-600";
      case "Tough":
        return "bg-orange-500 hover:bg-orange-600";
      case "Very Tough":
        return "bg-destructive hover:bg-destructive/90";
      default:
        return "bg-muted hover:bg-muted/90";
    }
  };

  if (!title) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Task Details
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Step 2: Add details and we'll detect the difficulty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Task Title
              </label>
              <p className="p-3 rounded-md bg-background border border-border text-foreground">
                {title}
              </p>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add more details here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Due Date & Time (Optional)
              </label>
              <DateTimePicker date={dueDate} setDate={setDueDate} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Detected Difficulty
              </label>
              <Badge
                className={cn(
                  "text-white border-none text-base px-4 py-2",
                  getDifficultyBadgeClass(difficulty)
                )}
              >
                {difficulty}
              </Badge>
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Save Task
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/add-task"
              state={{ title }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to previous step
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddTaskDetails;