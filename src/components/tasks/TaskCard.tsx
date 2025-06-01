import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { Typography } from "../core-ui/typography";
import { Tag } from "../core-ui/tag";
import { StatusSelect } from "../core-ui/status-select";
import { Calendar, Clock, Edit2, Trash2, User } from "lucide-react";
import {
  getTaskPriorityConfig,
  getTaskTypeConfig,
} from "../../utils/taskUtils";
import { formatDate } from "../../utils/dateUtils";
import { useAuthStore } from "@/store/authStore";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { user } = useAuthStore();
  const taskPriorityConfig = getTaskPriorityConfig(task.priority);
  const taskTypeConfig = getTaskTypeConfig(task.type);

  // Filter out 'done' option for developers
  const availableStatusOptions = statusOptions;

  return (
    <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='p-6 relative'>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex-1 gap-2 flex flex-col'>
            <Typography variant='h3' className=''>
              {task.title}
            </Typography>
            <div className='flex items-center gap-2 '>
              <Tag
                label={taskPriorityConfig?.label}
                variant={taskPriorityConfig?.variant}
                size='sm'
              />
              <Tag
                label={taskTypeConfig?.label}
                variant={taskTypeConfig?.variant}
                size='sm'
              />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onEdit(task)}
              className='p-2 rounded-full hover:bg-gray-100 transition-colors'
            >
              <Edit2 className='h-4 w-4 text-gray-600' />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className='p-2 rounded-full hover:bg-gray-100 transition-colors'
            >
              <Trash2 className='h-4 w-4 text-gray-600' />
            </button>
          </div>
        </div>

        <Typography variant='body' tone='muted' className='mb-4'>
          {task.description}
        </Typography>

        {/* task dates */}
        <div className='flex  gap-1 flex-col mt-4 mb-2'>
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Clock className='h-4 w-4' />
            <span className='font-small text-gray-500 '>Created:</span>{" "}
            {formatDate(task.createdAt)}
          </div>
          {task.dueDate && (
            <div className='flex items-center gap-1 text-sm text-gray-500'>
              <Calendar className='h-4 w-4' />
              <span className='text-sm text-gray-500'>Due:</span>{" "}
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
        <div className='border-t h-2 w-full mb-2 border-gray-200'> </div>

        <div className='flex items-center justify-between text-sm text-gray-500'>
          {task.assignee && (
            <div className='flex items-center gap-2 group relative'>
              <User className='h-4 w-4 text-gray-400' size={12} />
              <Typography
                variant='body-sm'
                tone='default'
                className='font-medium whitespace-nowrap'
              >
                {task?.assignee?.name}
              </Typography>
              <div className='absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                Assignment to developer
              </div>
            </div>
          )}

          <div className='flex justify-end w-full bottom-0'>
            <StatusSelect
              options={availableStatusOptions}
              value={task.status}
              onChange={(value) => onStatusChange(task.id, value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
