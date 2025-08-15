export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  difficulty: "Very Easy" | "Easy" | "Medium" | "Tough" | "Very Tough";
  dueDate?: string;
}