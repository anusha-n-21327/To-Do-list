import * as React from "react";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [time, setTime] = React.useState("00:00");

  React.useEffect(() => {
    if (date) {
      setTime(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) {
      setDate(undefined);
      return;
    }
    const [hours, minutes] = time.split(":").map(Number);
    let newDate = setHours(selectedDay, hours);
    newDate = setMinutes(newDate, minutes);
    newDate = setSeconds(newDate, 0);
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        let newDate = setHours(date, hours);
        newDate = setMinutes(newDate, minutes);
        setDate(newDate);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white",
            !date && "text-slate-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}