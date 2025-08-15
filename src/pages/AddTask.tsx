import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      navigate("/add-task-details", { state: { title: title.trim() } });
    }
  };

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
            Add a New Task
          </CardTitle>
          <CardDescription className="text-center text-subtitle">
            Let's start with the big picture. What's the mission?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Task Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="What's your next mission?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to list
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddTask;