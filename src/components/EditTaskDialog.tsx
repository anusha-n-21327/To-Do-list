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
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the due date and time for your task.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Task Title
            </label>
            <p className="p-3 rounded-md bg-background border border-border text-foreground">
              {task.text}
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-muted-foreground">
              Due Date & Time
            </label>
            <DateTimePicker date={dueDate} setDate={setDueDate} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-muted hover:bg-muted/90 border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};