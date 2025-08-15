import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Todo } from "@/types/todo";
import { ArrowLeft } from "lucide-react";
import { DateTimePicker } from "@/components/DateTimePicker";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIconForTask } from "@/utils/icon-mapper";

const AddTaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title;

  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Todo["difficulty"]>("Easy");
  const [dueDate, setDueDate] = useState<Date>();

  useEffect(() => {
    if (!title) {
      navigate("/add-task");
    }
  }, [title, navigate]);

  const handleSave = () => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: title,
      description,
      completed: false,
      difficulty,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      icon: getIconForTask(title, description),
    };

    try {
      const savedTodos = localStorage.getItem("todos");
      const todos = savedTodos ? JSON.parse(savedTodos) : [];
      const updatedTodos = [newTodo, ...todos];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save todo to localStorage", error);
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
          <CardTitle className="text-center text-2xl font-bold tracking-tight bg-gradient-to-r from-title-from via-title-via to-title-to text-transparent bg-clip-text">
            Task Details
          </CardTitle>
          <CardDescription className="text-center text-subtitle">
            Great! Now, let's add some details.
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
                placeholder="Unpack your mission... what are the details?"
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
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Difficulty
              </label>
              <Select
                value={difficulty}
                onValueChange={(value: Todo["difficulty"]) =>
                  setDifficulty(value)
                }
              >
                <SelectTrigger
                  id="difficulty"
                  className="w-full bg-input border-border"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Easy">Very Easy</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Challenging">Challenging</SelectItem>
                  <SelectItem value="Tough">Tough</SelectItem>
                  <SelectItem value="Difficult">Difficult</SelectItem>
                  <SelectItem value="Very Tough">Very Tough</SelectItem>
                </SelectContent>
              </Select>
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