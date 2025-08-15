import { Todo } from "@/types/todo";

export const isCompleted = (todo: Todo): boolean => todo.completed;

export const isMissed = (todo: Todo): boolean =>
  !todo.completed && !!todo.dueDate && new Date(todo.dueDate) < new Date();

export const isPending = (todo: Todo): boolean => !todo.completed;

// Active tasks are pending tasks that are not missed.
export const isActive = (todo: Todo): boolean =>
  !todo.completed && (!todo.dueDate || new Date(todo.dueDate) >= new Date());

export const getCompletedTasks = (todos: Todo[]): Todo[] =>
  todos.filter(isCompleted);

export const getMissedTasks = (todos: Todo[]): Todo[] =>
  todos.filter(isMissed);

export const getPendingTasks = (todos: Todo[]): Todo[] =>
  todos.filter(isPending);

export const getActiveTasks = (todos: Todo[]): Todo[] =>
  todos.filter(isActive);