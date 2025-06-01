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
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // TODO: Implement task deletion
    }
  };

  const handlePriorityChange = (taskId: string, priority: string) => {
    // TODO: Implement priority change
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <Typography variant='h1'>Dashboard</Typography>
            <Button
              variant='primary'
              size='medium'
              onClick={() => {
                setEditingTask(undefined);
                setShowTaskForm(true);
              }}
              leftIcon={<Plus className='w-4 h-4' />}
            >
              Add Task
            </Button>
          </div>

          <TaskStats tasks={tasks} />

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-4'>
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
                    onPriorityChange={handlePriorityChange}
                  />
                ))}
              </div>
            </div>

            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow-sm p-4'>
                <Typography variant='h3' className='mb-4'>
                  Time Tracking
                </Typography>
                <TimeTrackingChart tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
