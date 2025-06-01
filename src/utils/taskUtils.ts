import { TaskStatus, TaskPriority, TaskType } from "@/types/task";

interface TaskConfig {
  label: string;
  variant: "default" | "success" | "warning" | "danger" | "info";
}

export const getTaskStatusConfig = (status: TaskStatus): TaskConfig => {
  const configs: Record<TaskStatus, TaskConfig> = {
    todo: {
      label: "To Do",
      variant: "default",
    },
    in_progress: {
      label: "In Progress",
      variant: "info",
    },
    review: {
      label: "Review",
      variant: "warning",
    },
    done: {
      label: "Done",
      variant: "success",
    },
  };

  return configs[status];
};

export const getTaskPriorityConfig = (priority: TaskPriority): TaskConfig => {
  const configs: Record<TaskPriority, TaskConfig> = {
    low: {
      label: "Low",
      variant: "default",
    },
    medium: {
      label: "Medium",
      variant: "warning",
    },
    high: {
      label: "High",
      variant: "danger",
    },
  };

  return configs[priority];
};

export const getTaskTypeConfig = (type: TaskType): TaskConfig => {
  const configs: Record<TaskType, TaskConfig> = {
    feature: {
      label: "Feature",
      variant: "info",
    },
    bug: {
      label: "Bug",
      variant: "danger",
    },
    improvement: {
      label: "Improvement",
      variant: "default",
    },
  };

  return configs[type];
};
