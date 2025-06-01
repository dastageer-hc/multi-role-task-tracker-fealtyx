import React from "react";
import { Typography } from "../core-ui/typography";
import { Task, TaskStatus } from "@/types/task";

interface TaskStatsProps {
  tasks?: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks = [] }) => {
  const stats = {
    total: tasks?.length || 0,
    completed:
      tasks?.filter((task) => task.status === ("done" as TaskStatus)).length ||
      0,
    inProgress:
      tasks?.filter((task) => task.status === ("in_progress" as TaskStatus))
        .length || 0,
    todo:
      tasks?.filter((task) => task.status === ("todo" as TaskStatus)).length ||
      0,
    review:
      tasks?.filter((task) => task.status === ("review" as TaskStatus))
        .length || 0,
  };

  return (
    <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
      <Typography variant='h3' className='mb-4'>
        Overview
      </Typography>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
            <Typography variant='h2' className='text-gray-600'>
              {stats.total}
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            Total Tasks
          </Typography>
        </div>

        <div className='bg-green-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-green-200 flex items-center justify-center'>
            <Typography variant='h2' className='text-green-600'>
              {stats.completed}
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            Completed
          </Typography>
        </div>

        <div className='bg-blue-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center'>
            <Typography variant='h2' className='text-blue-600'>
              {stats.inProgress}
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            In Progress
          </Typography>
        </div>

        <div className='bg-yellow-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center'>
            <Typography variant='h2' className='text-yellow-600'>
              {stats.todo}
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            To Do
          </Typography>
        </div>

        <div className='bg-purple-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center'>
            <Typography variant='h2' className='text-purple-600'>
              {stats.review}
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            In Review
          </Typography>
        </div>

        <div className='bg-gray-50 rounded-lg p-4 flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
            <Typography variant='body-sm' className='text-gray-600 font-bold'>
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </Typography>
          </div>
          <Typography variant='body-sm' tone='muted'>
            Completion Rate
          </Typography>
        </div>
      </div>
    </div>
  );
};
