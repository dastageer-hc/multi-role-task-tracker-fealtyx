"use client";

import React, { useState, useEffect } from "react";
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskFilters,
  TaskSort,
} from "@/types/task";
import { useTaskStore } from "@/store/taskStore";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { TimeTrackingChart } from "@/components/TimeTrackingChart";
import { TaskStats } from "@/components/TaskStats";
import { TaskFilters as TaskFiltersComponent } from "@/components/TaskFilters";
import { Typography } from "@/components/core-ui/typography";
import { Button } from "@/components/core-ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Dashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth state
  const { user } = useAuthStore();

  // Get store methods
  const {
    tasks,
    filters,
    sort,
    deleteTask,
    setFilters,
    setSort,
    getFilteredTasks,
    initializeTaskStore,
  } = useTaskStore();

  // Initialize store
  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }
        await initializeTaskStore();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize store:", error);
        setError(
          error instanceof Error ? error.message : "Failed to initialize store"
        );
        setIsLoading(false);
      }
    };
    init();
  }, [initializeTaskStore, user]);

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSortChange = (field: keyof Task) => {
    const newDirection =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    setSort({ field, direction: newDirection });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-600 text-center'>
          <Typography variant='h2' className='mb-2'>
            Error
          </Typography>
          <Typography variant='body'>{error}</Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <Typography variant='h2' className='mb-2'>
            Authentication Required
          </Typography>
          <Typography variant='body'>
            Please log in to access the dashboard.
          </Typography>
        </div>
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();
  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    pending: tasks.filter((t) => t.status === "review").length,
    closed: tasks.filter((t) => t.status === "closed").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date()).length,
  };

  return (
    <div className='p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <Typography variant='h1'>Task Dashboard</Typography>
            <Typography variant='body' tone='muted' className='mt-1'>
              Welcome back, {user.name} ({user.role})
            </Typography>
          </div>
          <Button
            variant='primary'
            size='md'
            icon={<Plus size={20} />}
            onClick={() => {
              setEditingTask(undefined);
              setShowTaskForm(true);
            }}
          >
            Create Task
          </Button>
        </div>

        {/* Overview Stats */}
        <TaskStats tasks={tasks} />

        {/* Time Tracking Chart (for managers only) */}
        {user.role === "manager" && (
          <div className='mb-8'>
            <TimeTrackingChart
              tasks={tasks}
              isManager={user.role === "manager"}
            />
          </div>
        )}

        {/* Filters and Search */}
        <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <TaskFiltersComponent
            filters={{
              search: filters.search || "",
              status: filters.status || undefined,
              priority: filters.priority || undefined,
              type: filters.type || undefined,
            }}
            setFilters={(newFilters) => {
              if (typeof newFilters === "function") {
                const prev = {
                  search: filters.search || "",
                  status: filters.status || undefined,
                  priority: filters.priority || undefined,
                  type: filters.type || undefined,
                };
                const updated = newFilters(prev);
                setFilters({
                  ...filters,
                  search: updated.search,
                  status: updated.status,
                  priority: updated.priority,
                  type: updated.type,
                });
              } else {
                setFilters({
                  ...filters,
                  search: newFilters.search,
                  status: newFilters.status,
                  priority: newFilters.priority,
                  type: newFilters.type,
                });
              }
            }}
            sortBy={sort.field as "dueDate" | "priority" | "createdAt"}
            setSortBy={(field) => setSort({ ...sort, field })}
            sortOrder={sort.direction}
            setSortOrder={(direction: "asc" | "desc") =>
              setSort({ ...sort, direction })
            }
          />
        </div>

        {/* Tasks List */}
        <div className='space-y-4'>
          {filteredTasks.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm p-8'>
              <div className='flex flex-col items-center justify-center space-y-2'>
                <Typography variant='body' tone='muted'>
                  No tasks found
                </Typography>
                <Typography variant='body-sm' tone='muted'>
                  Try adjusting your filters or create a new task
                </Typography>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                userRole={user.role}
              />
            ))
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl'>
            <Typography variant='h2' className='mb-4'>
              {editingTask ? "Edit Task" : "Create Task"}
            </Typography>
            <TaskForm
              task={editingTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(undefined);
              }}
              userRole={user.role}
            />
          </div>
        </div>
      )}
    </div>
  );
}
