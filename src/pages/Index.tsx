import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TodoItem } from "@/components/TodoItem";
import { Todo } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

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
    // This effect ensures that changes made on this page (toggle, delete) are saved.
    // It avoids writing an empty array on initial load before todos are fetched.
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-cyan-500 text-transparent bg-clip-text">
              Todo List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Link to="/add-task" className="w-full">
                <Button className="w-full bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a new task
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))
              ) : (
                <p className="text-center text-slate-500">
                  No todos yet. Add one to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-0">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;