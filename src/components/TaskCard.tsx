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
            <select
              value={task.status}
              onChange={handleStatusChange}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                taskStatusConfig?.color || "bg-gray-100 text-gray-800"
              }`}
              disabled={userRole === "developer" && task.status === "closed"}
            >
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div className='flex items-center text-sm text-gray-500'>
              <Clock size={16} className='mr-1' />
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </div>

            {isOverdue && (
              <div className='flex items-center text-sm text-red-500'>
                <AlertCircle size={16} className='mr-1' />
                Overdue
              </div>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => onEdit(task)}
              className='p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700'
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className='p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600'
            >
              <Trash2 size={18} />
            </button>
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
              <div>
                <Typography variant='body-sm' tone='muted'>
                  Estimated:
                </Typography>
                <Typography variant='body' className='ml-2'>
                  {task.estimatedHours}h
                </Typography>
              </div>
              <div>
                <Typography variant='body-sm' tone='muted'>
                  Spent:
                </Typography>
                <Typography variant='body' className='ml-2'>
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
              <ul className='list-disc list-inside'>
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
            <button
              onClick={() => setShowComments(!showComments)}
              className='flex items-center text-sm text-gray-500 hover:text-gray-700'
            >
              <MessageSquare size={16} className='mr-1' />
              <Typography variant='body-sm'>
                Comments ({task.comments?.length || 0})
              </Typography>
            </button>

            {showComments && (
              <div className='mt-2'>
                {/* Comments List */}
                <div className='space-y-3 mb-4'>
                  {task.comments?.map((comment) => (
                    <div key={comment.id} className='bg-gray-50 p-3 rounded-lg'>
                      <div className='flex items-center justify-between mb-1'>
                        <Typography variant='body-sm' className='font-medium'>
                          {comment.authorName}
                        </Typography>
                        <Typography variant='body-sm' tone='muted'>
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </Typography>
                      </div>
                      <Typography variant='body'>{comment.content}</Typography>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className='mt-4'>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder='Add a comment...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    rows={2}
                  />
                  <button
                    type='submit'
                    className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                  >
                    Add Comment
                  </button>
                </form>
              </div>
            )}
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
