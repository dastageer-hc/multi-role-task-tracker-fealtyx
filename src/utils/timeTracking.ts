import { Task, TimeEntry } from "../types/task";

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

export const calculateTotalTime = (timeEntries: TimeEntry[]): number => {
  return timeEntries.reduce((total, entry) => {
    if (entry.endTime) {
      return total + entry.duration;
    }
    // For ongoing entries, calculate duration up to now
    const now = new Date();
    const start = new Date(entry.startTime);
    const duration = Math.floor((now.getTime() - start.getTime()) / 1000);
    return total + duration;
  }, 0);
};

export const startTimeTracking = (task: Task): Task => {
  const newTimeEntry: TimeEntry = {
    startTime: new Date().toISOString(),
    endTime: undefined,
    duration: 0,
    id: "",
    userId: "",
    userName: "",
  };

  return {
    ...task,
    timeEntries: [...task.timeEntries, newTimeEntry],
  };
};

export const stopTimeTracking = (task: Task): Task => {
  const lastEntry = task.timeEntries[task.timeEntries.length - 1];
  if (!lastEntry || lastEntry.endTime) return task;

  const endTime = new Date().toISOString();
  const startTime = new Date(lastEntry.startTime);
  const endTimeDate = new Date(endTime);
  const duration = Math.floor(
    (endTimeDate.getTime() - startTime.getTime()) / 1000
  );

  const updatedTimeEntries = task.timeEntries.map((entry, index) => {
    if (index === task.timeEntries.length - 1) {
      return { ...entry, endTime, duration };
    }
    return entry;
  });

  const totalTimeSpent = calculateTotalTime(updatedTimeEntries);

  return {
    ...task,
    timeEntries: updatedTimeEntries,
    totalTimeSpent,
  };
};
