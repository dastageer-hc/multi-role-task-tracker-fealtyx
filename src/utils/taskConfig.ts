import { AlertCircle, Clock, CheckCircle, User } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types/task";

interface StatusConfig {
  label: string;
  color: string;
  icon?: React.ComponentType;
}

interface PriorityConfig {
  label: string;
  color: string;
  icon?: React.ComponentType;
}

export const statusConfig: Record<TaskStatus, StatusConfig> = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  review: {
    label: "In Review",
    color: "bg-purple-100 text-purple-800",
    icon: User,
  },
  closed: {
    label: "Closed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
};

export const priorityConfig: Record<TaskPriority, PriorityConfig> = {
  low: {
    label: "Low",
    color: "bg-gray-100 text-gray-800",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800",
  },
  high: {
    label: "High",
    color: "bg-red-100 text-red-800",
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-200 text-red-900",
  },
};
