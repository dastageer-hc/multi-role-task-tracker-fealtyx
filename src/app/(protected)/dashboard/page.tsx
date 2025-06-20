"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import {
  TaskForm,
  TaskFilters,
  TaskStats,
  TimeTrackingChart,
  TaskCard,
} from "@/components/tasks";
import { PlusIcon } from "lucide-react";
import { Typography } from "@/components/core-ui/typography";
import { Button } from "@/components/core-ui/button";
import { Task, TaskStatus, TaskPriority, TaskType } from "@/types/task";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } =
    useTaskStore();
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

  const handleAddTask = (task: Partial<Task>) => {
    addTask(task);
    setShowTaskForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleUpdateTask = (task: Partial<Task>) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, task);
      setShowTaskForm(false);
      setEditingTask(undefined);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

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
      <div className='max-w-[2000px] mx-auto p-6 relative'>
        <div className='flex items-center justify-between mb-6 absolute top-0 pb-5 pt-5  bg-gray-50 w-[95%]'>
          <div className='flex gap-2 flex-col'>
            <Typography variant='h2'> Dashboard</Typography>
          </div>
          <Button onClick={() => setShowTaskForm(true)} leftIcon={<PlusIcon />}>
            Create New Task
          </Button>
        </div>

        <div className='pt-[5rem]'></div>
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
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
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
          <div className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full'>
              <div className='flex items-center justify-between mb-6'>
                <Typography variant='h2'>
                  {editingTask ? "Edit Task" : "Create New Task"}
                </Typography>
                <Button
                  variant='secondary'
                  size='small'
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
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
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
