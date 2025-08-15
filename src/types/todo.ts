export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  difficulty:
    | "Very Easy"
    | "Easy"
    | "Challenging"
    | "Tough"
    | "Difficult"
    | "Very Tough";
  dueDate?: string;
  icon: string;
}