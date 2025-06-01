// src/store/taskStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Task,
  TaskStatus,
  Comment,
  TimeEntry,
  Attachment,
  TaskFilters,
  TaskSort,
} from "@/types/task";
import { startTimeTracking, stopTimeTracking } from "@/utils/timeTracking";

const STORAGE_KEYS = {
  TASKS: "tasks",
  TASK_FILTERS: "task-filters",
  TASK_SORT: "task-sort",
} as const;

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to calculate total time spent
const calculateTotalTime = (timeEntries: TimeEntry[]): number => {
  return timeEntries.reduce((total, entry) => {
    if (entry.duration) {
      return total + entry.duration;
    }
    if (entry.startTime && entry.endTime) {
      const duration =
        new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
      return total + Math.floor(duration / (1000 * 60)); // Convert to minutes
    }
    return total;
  }, 0);
};

// LocalStorage helper functions
const storage = {
  setItem: (key: string, value: any) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Dummy tasks for initial data
const createDummyTasks = (): Task[] => [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    type: "feature",
    status: "open",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedHours: 8,
    actualHours: 0,
    tags: ["auth", "security"],
    comments: [],
    timeEntries: [],
    totalTimeSpent: 0,
    attachments: [],
  },
  {
    id: "2",
    title: "Fix navigation bug",
    description: "Navigation menu not working on mobile devices",
    type: "bug",
    status: "in_progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedHours: 4,
    actualHours: 0,
    tags: ["bug", "mobile"],
    comments: [],
    timeEntries: [],
    totalTimeSpent: 0,
    attachments: [],
  },
];

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addComment: (
    taskId: string,
    comment: Omit<Comment, "id" | "createdAt">
  ) => void;
  updateComment: (taskId: string, commentId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  addTimeEntry: (taskId: string, timeEntry: Omit<TimeEntry, "id">) => void;
  updateTimeEntry: (
    taskId: string,
    timeEntryId: string,
    updates: Partial<TimeEntry>
  ) => void;
  deleteTimeEntry: (taskId: string, timeEntryId: string) => void;
  addAttachment: (
    taskId: string,
    attachment: Omit<Attachment, "id" | "uploadedAt">
  ) => void;
  deleteAttachment: (taskId: string, attachmentId: string) => void;
  addSubtask: (
    parentTaskId: string,
    subtask: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => void;
  removeSubtask: (parentTaskId: string, subtaskId: string) => void;
  addDependency: (taskId: string, dependencyId: string) => void;
  removeDependency: (taskId: string, dependencyId: string) => void;
  addRelatedTask: (taskId: string, relatedTaskId: string) => void;
  removeRelatedTask: (taskId: string, relatedTaskId: string) => void;
  setFilters: (filters: TaskFilters) => void;
  setSort: (sort: TaskSort) => void;
  getFilteredTasks: () => Task[];
  getTotalTimeSpent: (taskId: string) => number;
  initializeTaskStore: () => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: createDummyTasks(),
      filters: {},
      sort: { field: "createdAt", direction: "desc" },

      addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              comments: [],
              timeEntries: [],
              attachments: [],
              totalTimeSpent: 0,
            },
          ],
        })),

      updateTask: (taskId: string, updates: Partial<Task>) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      deleteTask: (taskId: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      updateTaskStatus: (taskId: string, newStatus: TaskStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      addComment: (
        taskId: string,
        comment: Omit<Comment, "id" | "createdAt">
      ) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [
                    ...task.comments,
                    {
                      ...comment,
                      id: Date.now().toString(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      updateComment: (taskId: string, commentId: string, content: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: task.comments.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          content,
                          updatedAt: new Date().toISOString(),
                        }
                      : comment
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      deleteComment: (taskId: string, commentId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: task.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      addTimeEntry: (taskId: string, timeEntry: Omit<TimeEntry, "id">) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  timeEntries: [
                    ...task.timeEntries,
                    {
                      ...timeEntry,
                      id: Date.now().toString(),
                    },
                  ],
                  totalTimeSpent: task.totalTimeSpent + timeEntry.duration,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      updateTimeEntry: (
        taskId: string,
        timeEntryId: string,
        updates: Partial<TimeEntry>
      ) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const oldTimeEntry = task.timeEntries.find(
            (te) => te.id === timeEntryId
          );
          if (!oldTimeEntry) return state;

          const newTimeEntry = { ...oldTimeEntry, ...updates };
          const timeDiff =
            (updates.duration || oldTimeEntry.duration) - oldTimeEntry.duration;

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    timeEntries: t.timeEntries.map((te) =>
                      te.id === timeEntryId ? newTimeEntry : te
                    ),
                    totalTimeSpent: t.totalTimeSpent + timeDiff,
                    updatedAt: new Date().toISOString(),
                  }
                : t
            ),
          };
        }),

      deleteTimeEntry: (taskId: string, timeEntryId: string) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const timeEntry = task.timeEntries.find(
            (te) => te.id === timeEntryId
          );
          if (!timeEntry) return state;

          return {
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    timeEntries: t.timeEntries.filter(
                      (te) => te.id !== timeEntryId
                    ),
                    totalTimeSpent: t.totalTimeSpent - timeEntry.duration,
                    updatedAt: new Date().toISOString(),
                  }
                : t
            ),
          };
        }),

      addAttachment: (
        taskId: string,
        attachment: Omit<Attachment, "id" | "uploadedAt">
      ) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: [
                    ...task.attachments,
                    {
                      ...attachment,
                      id: Date.now().toString(),
                      uploadedAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      deleteAttachment: (taskId: string, attachmentId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: task.attachments.filter(
                    (a) => a.id !== attachmentId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      addSubtask: (
        parentTaskId: string,
        subtask: Omit<Task, "id" | "createdAt" | "updatedAt">
      ) =>
        set((state) => {
          const newSubtask = {
            ...subtask,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
            timeEntries: [],
            attachments: [],
            totalTimeSpent: 0,
            parentTaskId,
          };

          return {
            tasks: [
              ...state.tasks,
              newSubtask,
              ...state.tasks.map((task) =>
                task.id === parentTaskId
                  ? {
                      ...task,
                      subtasks: [...(task.subtasks || []), newSubtask],
                      updatedAt: new Date().toISOString(),
                    }
                  : task
              ),
            ],
          };
        }),

      removeSubtask: (parentTaskId: string, subtaskId: string) =>
        set((state) => ({
          tasks: state.tasks
            .filter((task) => task.id !== subtaskId)
            .map((task) =>
              task.id === parentTaskId
                ? {
                    ...task,
                    subtasks: task.subtasks?.filter(
                      (st) => st.id !== subtaskId
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
        })),

      addDependency: (taskId: string, dependencyId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  dependencies: [...(task.dependencies || []), dependencyId],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      removeDependency: (taskId: string, dependencyId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  dependencies: task.dependencies?.filter(
                    (d) => d !== dependencyId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      addRelatedTask: (taskId: string, relatedTaskId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  relatedTasks: [...(task.relatedTasks || []), relatedTaskId],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      removeRelatedTask: (taskId: string, relatedTaskId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  relatedTasks: task.relatedTasks?.filter(
                    (rt) => rt !== relatedTaskId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      setFilters: (filters: TaskFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setSort: (sort: TaskSort) =>
        set((state) => ({
          sort,
        })),

      getFilteredTasks: () => {
        const state = get();
        let filteredTasks = [...state.tasks];

        // Apply filters
        if (state.filters.status) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.status === state.filters.status
          );
        }
        if (state.filters.priority) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.priority === state.filters.priority
          );
        }
        if (state.filters.type) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.type === state.filters.type
          );
        }
        if (state.filters.assignee) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.assignee?.id === state.filters.assignee
          );
        }
        if (state.filters.search) {
          const searchLower = state.filters.search.toLowerCase();
          filteredTasks = filteredTasks.filter(
            (task: Task) =>
              task.title.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower)
          );
        }
        if (state.filters.dateRange) {
          const { start, end } = state.filters.dateRange;
          filteredTasks = filteredTasks.filter(
            (task: Task) =>
              new Date(task.dueDate) >= new Date(start) &&
              new Date(task.dueDate) <= new Date(end)
          );
        }
        if (state.filters.tags?.length) {
          filteredTasks = filteredTasks.filter((task: Task) =>
            state.filters.tags?.some((tag) => task.tags.includes(tag))
          );
        }
        if (state.filters.sprintId) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.sprintId === state.filters.sprintId
          );
        }
        if (state.filters.hasAttachments) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.attachments.length > 0
          );
        }
        if (state.filters.hasComments) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => task.comments.length > 0
          );
        }
        if (state.filters.isOverdue) {
          filteredTasks = filteredTasks.filter(
            (task: Task) =>
              new Date(task.dueDate) < new Date() && task.status !== "closed"
          );
        }
        if (state.filters.hasSubtasks) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => (task.subtasks?.length ?? 0) > 0
          );
        }
        if (state.filters.hasDependencies) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => (task.dependencies?.length ?? 0) > 0
          );
        }
        if (state.filters.hasRelatedTasks) {
          filteredTasks = filteredTasks.filter(
            (task: Task) => (task.relatedTasks?.length ?? 0) > 0
          );
        }

        // Apply sorting
        if (state.sort.field) {
          filteredTasks.sort((a: Task, b: Task) => {
            const aValue = a[state.sort.field as keyof Task];
            const bValue = b[state.sort.field as keyof Task];

            if (typeof aValue === "string" && typeof bValue === "string") {
              return state.sort.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            if (aValue instanceof Date && bValue instanceof Date) {
              return state.sort.direction === "asc"
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime();
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
              return state.sort.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
            }

            return 0;
          });
        }

        return filteredTasks;
      },

      getTotalTimeSpent: (taskId: string) => {
        const task = get().tasks.find((t) => t.id === taskId);
        return task ? task.totalTimeSpent : 0;
      },

      initializeTaskStore: async () => {
        const state = get();
        if (state.tasks.length === 0) {
          set({ tasks: createDummyTasks() });
        }
      },
    }),
    {
      name: "task-storage",
    }
  )
);

// Initialize store with data from localStorage or dummy data
export const initializeTaskStore = () => {
  const storedTasks = storage.getItem<Task[]>(STORAGE_KEYS.TASKS);
  const storedFilters = storage.getItem<TaskFilters>(STORAGE_KEYS.TASK_FILTERS);
  const storedSort = storage.getItem<TaskSort>(STORAGE_KEYS.TASK_SORT);

  useTaskStore.setState({
    tasks: storedTasks || createDummyTasks(),
    filters: storedFilters || {},
    sort: storedSort || { field: "createdAt", direction: "desc" },
  });

  // Save dummy data if no stored tasks exist
  if (!storedTasks) {
    storage.setItem(STORAGE_KEYS.TASKS, createDummyTasks());
  }
};
