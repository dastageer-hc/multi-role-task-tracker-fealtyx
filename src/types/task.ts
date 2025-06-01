export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "feature" | "bug" | "improvement";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "manager" | "developer";
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description?: string;
  userId: string;
  userName: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  comments: Comment[];
  timeEntries: TimeEntry[];
  totalTimeSpent: number;
  attachments: Attachment[];
  storyPoints: number;
  acceptanceCriteria: string[];
  testCases: string[];
  assignee?: User;
  parentTaskId?: string;
  subtasks?: Task[];
  dependencies?: string[];
  relatedTasks?: string[];
  sprintId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  assignee?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  sprintId?: string;
  hasAttachments?: boolean;
  hasComments?: boolean;
  isOverdue?: boolean;
  hasSubtasks?: boolean;
  hasDependencies?: boolean;
  hasRelatedTasks?: boolean;
}

export interface TaskSort {
  field: keyof Task;
  direction: "asc" | "desc";
}
