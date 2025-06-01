import {
  AlertCircle,
  Clock,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";

export const statusConfig = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
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
