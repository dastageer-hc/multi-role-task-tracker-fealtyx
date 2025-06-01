import {
  AlertCircle,
  Clock,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";
import { TaskStatus } from "@/types/task";

interface StatusConfig {
  label: string;
  color: string;
}

export const taskStatusConfig: Record<TaskStatus, StatusConfig> = {
  todo: {
    label: "To Do",
    color: "bg-blue-100 text-blue-800",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
  },
  review: {
    label: "In Review",
    color: "bg-purple-100 text-purple-800",
  },
  done: {
    label: "Done",
    color: "bg-green-100 text-green-800",
  },
};

export const statusConfig = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  "approval-pending": {
    label: "Approval Pending",
    color: "bg-purple-100 text-purple-800",
    icon: UserIcon,
  },
  closed: {
    label: "Closed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
};
