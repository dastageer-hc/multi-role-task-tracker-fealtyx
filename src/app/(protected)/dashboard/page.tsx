"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm } from "@/components/TaskForm";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskStats } from "@/components/TaskStats";
import { TimeTrackingChart } from "@/components/TimeTrackingChart";
import { Typography } from "@/components/core-ui/typography";
import { Button } from "@/components/core-ui/button";
import { Task, TaskStatus, TaskPriority, TaskType } from "@/types/task";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<
    Partial<Task> | undefined
  >();
  const [filters, setFilters] = React.useState({
    search: "",
    status: "" as TaskStatus | "",
    priority: "" as TaskPriority | "",
    type: "" as TaskType | "",
  });
  const [sortBy, setSortBy] = React.useState<
    "dueDate" | "priority" | "createdAt"
  >("dueDate");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const filteredTasks = React.useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          task.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = !filters.status || task.status === filters.status;
        const matchesPriority =
          !filters.priority || task.priority === filters.priority;
        const matchesType = !filters.type || task.type === filters.type;
        return matchesSearch && matchesStatus && matchesPriority && matchesType;
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const modifier = sortOrder === "asc" ? 1 : -1;
        return aValue < bValue
          ? -1 * modifier
          : aValue > bValue
          ? 1 * modifier
          : 0;
      });
  }, [tasks, filters, sortBy, sortOrder]);

  const handleTaskSubmit = (task: Partial<Task>) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
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

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Typography variant='h2'>
          Please log in to view the dashboard
        </Typography>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-[2000px] mx-auto p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <Typography variant='h1'>Welcome, {user.name}</Typography>
            <Typography variant='body' tone='muted'>
              {user.role === "manager"
                ? "Manager Dashboard"
                : "Developer Dashboard"}
            </Typography>
          </div>
          <Button onClick={() => setShowTaskForm(true)}>Create New Task</Button>
        </div>

        <TaskStats tasks={tasks} />

        {user.role === "manager" && (
          <div className='mb-8 w-full'>
            <TimeTrackingChart tasks={tasks} />
          </div>
        )}

        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <Typography variant='h3' className='mb-2'>
                    {task.title}
                  </Typography>
                  <Typography variant='body' tone='muted' className='mb-4'>
                    {task.description}
                  </Typography>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "in_progress"
                        ? "bg-blue-500"
                        : task.status === "review"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <Typography variant='body' tone='muted'>
                    {task.status.replace("_", " ")}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <Typography variant='body' tone='muted'>
                    {task.priority}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className='bg-white rounded-lg shadow-sm p-8'>
            <div className='flex flex-col items-center justify-center space-y-2'>
              <Typography variant='h3'>No tasks found</Typography>
              <Typography variant='body' tone='muted'>
                Try adjusting your filters or create a new task
              </Typography>
            </div>
          </div>
        )}

        {showTaskForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full'>
              <div className='flex items-center justify-between mb-6'>
                <Typography variant='h2'>
                  {editingTask ? "Edit Task" : "Create New Task"}
                </Typography>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <TaskForm
                task={editingTask}
                onSubmit={handleTaskSubmit}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(undefined);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
