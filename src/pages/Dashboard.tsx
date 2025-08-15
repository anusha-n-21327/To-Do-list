import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import {
  getCompletedTasks,
  getMissedTasks,
  getPendingTasks,
  getActiveTasks,
} from "@/utils/task-categorizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadTodos = () => {
      try {
        const savedTodos = localStorage.getItem("todos");
        const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
        setTodos(parsedTodos);
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
        setTodos([]);
      }
    };
    loadTodos();
  }, []);

  const activeTasks = getActiveTasks(todos);
  const completedTasks = getCompletedTasks(todos);
  const missedTasks = getMissedTasks(todos);
  const pendingTasks = getPendingTasks(todos);

  const renderTodoList = (tasks: Todo[], emptyMessage: string) => {
    if (tasks.length === 0) {
      return <p className="text-center text-slate-500 py-8">{emptyMessage}</p>;
    }
    return (
      <div className="space-y-4">
        {tasks.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="text-sm text-slate-400 hover:text-slate-200 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to list
              </Link>
              <CardTitle className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-cyan-500 text-transparent bg-clip-text">
                Task Dashboard
              </CardTitle>
              <div className="w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedTasks.length})
                </TabsTrigger>
                <TabsTrigger value="missed">
                  Missed ({missedTasks.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                {renderTodoList(pendingTasks, "No pending tasks.")}
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                {renderTodoList(activeTasks, "No active tasks.")}
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                {renderTodoList(completedTasks, "No tasks completed yet.")}
              </TabsContent>
              <TabsContent value="missed" className="mt-4">
                {renderTodoList(missedTasks, "No missed tasks. Great job!")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;