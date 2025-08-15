import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Todo } from "@/types/todo";

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Todo | null;
  onSave: (updatedTask: Todo) => void;
}

export const EditTaskDialog = ({
  isOpen,
  onClose,
  task,
  onSave,
}: EditTaskDialogProps) => {
  const [dueDate, setDueDate] = useState<Date | undefined>();

  useEffect(() => {
    if (task?.dueDate) {
      setDueDate(new Date(task.dueDate));
    } else {
      setDueDate(undefined);
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      const updatedTask = {
        ...task,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      };
      onSave(updatedTask);
      onClose();
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the due date and time for your task.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Task Title
            </label>
            <p className="p-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200">
              {task.text}
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-slate-300">
              Due Date & Time
            </label>
            <DateTimePicker date={dueDate} setDate={setDueDate} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 border-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};