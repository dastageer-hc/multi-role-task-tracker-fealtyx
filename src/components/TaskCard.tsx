import React from "react";
import { Task } from "@/types/task";
import { statusConfig, priorityConfig } from "@/utils/taskConfig";
import { Typography } from "./core-ui/typography";
import { Tag } from "./core-ui/tag";
import { Button } from "./core-ui/button";
import { Select } from "./core-ui/select";
import { Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onPriorityChange?: (taskId: string, priority: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onPriorityChange,
}) => {
  const taskStatusConfig = statusConfig[task.status];
  const taskPriorityConfig = priorityConfig[task.priority];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
      <div className='flex justify-between items-start mb-4'>
        <Typography variant='h3' className='text-gray-900 flex-1'>
          {task.title}
        </Typography>
        <div className='flex gap-2'>
          {onEdit && (
            <Button
              variant='ghost'
              size='small'
              onClick={() => onEdit(task)}
              leftIcon={<Pencil className='w-4 h-4' />}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Typography variant='body' tone='muted' className='mb-4'>
        {task.description}
      </Typography>

      <div className='flex items-center gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <Typography variant='body-sm' tone='muted'>
            Status:
          </Typography>
          <Tag
            label={taskStatusConfig.label}
            variant={
              taskStatusConfig.color.includes("red")
                ? "danger"
                : taskStatusConfig.color.includes("yellow")
                ? "warning"
                : taskStatusConfig.color.includes("green")
                ? "success"
                : taskStatusConfig.color.includes("blue")
                ? "info"
                : "default"
            }
          />
        </div>
        <div className='flex items-center gap-2'>
          <Typography variant='body-sm' tone='muted'>
            Priority:
          </Typography>
          <Tag
            label={taskPriorityConfig.label}
            variant={
              taskPriorityConfig.color.includes("red")
                ? "danger"
                : taskPriorityConfig.color.includes("yellow")
                ? "warning"
                : taskPriorityConfig.color.includes("green")
                ? "success"
                : taskPriorityConfig.color.includes("blue")
                ? "info"
                : "default"
            }
          />
        </div>
      </div>

      <div className='flex justify-between items-center'>
        {onDelete && (
          <Button
            variant='danger'
            size='small'
            onClick={() => onDelete(task.id)}
            leftIcon={<Trash2 className='w-4 h-4' />}
          >
            Delete
          </Button>
        )}
        {onPriorityChange && (
          <div className='w-40'>
            <Select
              options={priorityOptions}
              value={task.priority}
              onChange={(value) => onPriorityChange(task.id, value)}
              variant='small'
            />
          </div>
        )}
      </div>
    </div>
  );
};
