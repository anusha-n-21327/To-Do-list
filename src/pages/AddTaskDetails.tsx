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

  if (!title) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-cyan-500 text-transparent bg-clip-text">
            Task Details
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Step 2: Add details and we'll detect the difficulty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Task Title
              </label>
              <p className="p-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200">
                {title}
              </p>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add more details here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Due Date & Time (Optional)
              </label>
              <DateTimePicker date={dueDate} setDate={setDueDate} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              Save Task
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/add-task"
              state={{ title }}
              className="text-sm text-slate-400 hover:text-slate-200 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to previous step
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskDetails;