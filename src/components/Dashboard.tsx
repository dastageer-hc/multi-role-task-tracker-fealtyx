import React from "react";
import { TaskCard } from "./TaskCard";
import { TaskStats } from "./TaskStats";
import { TaskFilters } from "./TaskFilters";
import { TimeTrackingChart } from "./TimeTrackingChart";
import { Typography } from "./core-ui/typography";
import { Button } from "./core-ui/button";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilters as TaskFiltersType,
  TaskType,
} from "@/types/task";

export const Dashboard: React.FC = () => {
  const { tasks, filters, setFilters, sort, setSort } = useTaskStore();
  const { user } = useAuthStore();

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort.field === "dueDate") {
      return sort.direction === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    if (sort.field === "priority") {
      const priorityOrder: Record<TaskPriority, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      return sort.direction === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    pending: tasks.filter((t) => t.status === "review").length,
    closed: tasks.filter((t) => t.status === "closed").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date()).length,
  };

  const timeEntries = tasks.map((task) => ({
    date: new Date(task.createdAt).toLocaleDateString(),
    hours:
      (task.timeEntries || []).reduce(
        (sum, entry) => sum + (entry?.duration || 0),
        0
      ) / 60,
  }));

  const handleEditTask = (task: Task) => {
    // TODO: Implement task editing
  };

  const handleDeleteTask = (taskId: string) => {
    // TODO: Implement task deletion
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='sticky top-0 z-10 bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <Typography variant='h1'>Dashboard</Typography>
            <Button
              variant='primary'
              size='md'
              icon={<Plus className='w-4 h-4' />}
              onClick={() => {
                /* TODO: Implement task creation */
              }}
            >
              New Task
            </Button>
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-8'>
          <TaskStats stats={stats} />
          <TimeTrackingChart
            timeEntries={timeEntries}
            isManager={user?.role === "manager"}
          />
          <div className='space-y-4'>
            <TaskFilters
              filters={{
                search: filters.search || "",
                status: filters.status || "",
                priority: filters.priority || "",
                type: filters.type || "",
              }}
              setFilters={(newFilters) => {
                if (typeof newFilters === "function") {
                  const prev = {
                    search: filters.search || "",
                    status: filters.status || "",
                    priority: filters.priority || "",
                    type: filters.type || "",
                  };
                  const updated = newFilters(prev);
                  setFilters({
                    ...filters,
                    search: updated.search,
                    status: updated.status as TaskStatus | undefined,
                    priority: updated.priority as TaskPriority | undefined,
                    type: updated.type as TaskType | undefined,
                  });
                } else {
                  setFilters({
                    ...filters,
                    search: newFilters.search,
                    status: newFilters.status as TaskStatus | undefined,
                    priority: newFilters.priority as TaskPriority | undefined,
                    type: newFilters.type as TaskType | undefined,
                  });
                }
              }}
              sortBy={sort.field as "dueDate" | "priority" | "createdAt"}
              setSortBy={(field) => setSort({ ...sort, field })}
              sortOrder={sort.direction}
              setSortOrder={(direction) => setSort({ ...sort, direction })}
            />
            <div className='grid grid-cols-1 gap-4'>
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  userRole={user?.role || "developer"}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
