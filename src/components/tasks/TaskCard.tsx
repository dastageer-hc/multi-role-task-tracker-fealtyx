import React from "react";
import { Task } from "@/types/task";
import { Typography } from "../core-ui/typography";
import { Tag } from "../core-ui/tag";
import { Button } from "../core-ui/button";
import {
  getTaskStatusConfig,
  getTaskPriorityConfig,
  getTaskTypeConfig,
} from "../../utils/taskUtils";
import { formatDate } from "../../utils/dateUtils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const taskStatusConfig = getTaskStatusConfig(task.status);
  const taskPriorityConfig = getTaskPriorityConfig(task.priority);
  const taskTypeConfig = getTaskTypeConfig(task.type);

  return (
    <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <Typography variant='h3' className='mb-2'>
              {task.title}
            </Typography>
            <div className='flex items-center gap-2 mb-4'>
              <Tag
                label={taskStatusConfig?.label}
                variant={taskStatusConfig?.variant}
                size='sm'
              />
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
            <Button
              variant='secondary'
              size='small'
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant='danger'
              size='small'
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        <Typography variant='body' tone='muted' className='mb-4'>
          {task.description}
        </Typography>

        <div className='flex items-center justify-between text-sm text-gray-500'>
          <div className='flex items-center gap-4'>
            <div>
              <span className='font-medium'>Created:</span>{" "}
              {formatDate(task.createdAt)}
            </div>
            {task.dueDate && (
              <div>
                <span className='font-medium'>Due:</span>{" "}
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
          {task.assignee && (
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Assigned to:</span>
              {task.assignee.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
