import React, { useState } from "react";
import { Task, TaskStatus, Comment } from "@/types/task";
import { statusConfig, priorityConfig } from "@/utils/taskConfig";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Tag as TagIcon,
} from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { Typography } from "./core-ui/typography";
import { Tag } from "./core-ui/tag";
import { Button } from "./core-ui/button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  userRole: "manager" | "developer";
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  userRole,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const addComment = useTaskStore((state) => state.addComment);

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "closed";
  const taskStatusConfig = statusConfig[task.status];
  const taskPriorityConfig = priorityConfig[task.priority];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as TaskStatus);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(task.id, {
      content: newComment,
      authorId: "current-user-id", // Replace with actual user ID
      authorName: "Current User", // Replace with actual user name
    });

    setNewComment("");
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      {/* Header */}
      <div className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <Typography variant='h3' className='text-gray-900'>
                {task.title}
              </Typography>
              <Tag
                label={taskPriorityConfig.label}
                variant={
                  taskPriorityConfig.color === "bg-red-100"
                    ? "danger"
                    : taskPriorityConfig.color === "bg-yellow-100"
                    ? "warning"
                    : taskPriorityConfig.color === "bg-green-100"
                    ? "success"
                    : taskPriorityConfig.color === "bg-blue-100"
                    ? "info"
                    : "default"
                }
              />
            </div>
            <Typography variant='body' tone='muted' className='mt-1'>
              {task.description}
            </Typography>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='p-1 hover:bg-gray-100 rounded-full'
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className='mt-2 flex flex-wrap gap-2'>
            {task.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Status and Actions */}
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Typography variant='body-sm' tone='muted'>
                Status:
              </Typography>
              <Tag
                label={taskStatusConfig.label}
                variant={
                  taskStatusConfig.color === "bg-red-100"
                    ? "danger"
                    : taskStatusConfig.color === "bg-yellow-100"
                    ? "warning"
                    : taskStatusConfig.color === "bg-green-100"
                    ? "success"
                    : taskStatusConfig.color === "bg-blue-100"
                    ? "info"
                    : "default"
                }
              />
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body-sm' tone='muted'>
                Due:
              </Typography>
              <Typography variant='body-sm'>
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {userRole === "manager" && (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEdit(task)}
                  icon={<Edit size={16} />}
                >
                  <Typography variant='body-sm'>Edit</Typography>
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onDelete(task.id)}
                  icon={<Trash2 size={16} />}
                >
                  <Typography variant='body-sm'>Delete</Typography>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className='border-t border-gray-200 p-4'>
          {/* Time Tracking */}
          <div className='mb-4'>
            <Typography variant='h3' className='mb-2'>
              Time Tracking
            </Typography>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <Typography variant='body-sm' tone='muted'>
                  Estimated:
                </Typography>
                <Typography variant='body'>{task.estimatedHours}h</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <Typography variant='body-sm' tone='muted'>
                  Spent:
                </Typography>
                <Typography variant='body'>
                  {Math.round(task.totalTimeSpent / 60)}h
                </Typography>
              </div>
            </div>
          </div>

          {/* Acceptance Criteria */}
          {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
            <div className='mb-4'>
              <Typography variant='h3' className='mb-2'>
                Acceptance Criteria
              </Typography>
              <ul className='list-disc list-inside space-y-1'>
                {task.acceptanceCriteria.map((criterion, index) => (
                  <li key={index}>
                    <Typography variant='body'>{criterion}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <Typography variant='h3' className='mb-2'>
              Comments
            </Typography>
            <div className='space-y-4'>
              {task.comments?.map((comment, index) => (
                <div key={index} className='flex gap-3'>
                  <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                    <Typography variant='body-sm' className='font-medium'>
                      {comment.authorId.charAt(0)}
                    </Typography>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <Typography variant='body-sm' className='font-medium'>
                        {comment.authorId}
                      </Typography>
                      <Typography variant='body-sm' tone='muted'>
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </div>
                    <Typography variant='body' className='mt-1'>
                      {comment.content}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className='mt-4'>
              <Typography variant='h3' className='mb-2'>
                Attachments
              </Typography>
              <div className='space-y-2'>
                {task.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-sm text-blue-600 hover:text-blue-800'
                  >
                    <Paperclip size={16} className='mr-1' />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
