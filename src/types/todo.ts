export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  difficulty: "Very Easy" | "Easy" | "Challenging" | "Tough" | "Difficult";
  dueDate?: string;
  icon: string;
}