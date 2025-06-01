import React from "react";
import { Typography } from "./core-ui/typography";
import { Card } from "./core-ui/card";

interface TaskStatsProps {
  stats: {
    total: number;
    open: number;
    inProgress: number;
    pending: number;
    closed: number;
    highPriority: number;
    overdue: number;
  };
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Typography variant='h2'>Task Overview</Typography>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
        <Card padding='md'>
          <Typography variant='display' className='text-gray-900'>
            {stats.total}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            Total Tasks
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='accent'>
            {stats.open}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            Open
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='warning'>
            {stats.inProgress}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            In Progress
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='info'>
            {stats.pending}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            Pending
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='success'>
            {stats.closed}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            Closed
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='danger'>
            {stats.highPriority}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            High Priority
          </Typography>
        </Card>
        <Card padding='md'>
          <Typography variant='display' tone='danger'>
            {stats.overdue}
          </Typography>
          <Typography variant='body-sm' tone='muted'>
            Overdue
          </Typography>
        </Card>
      </div>
    </div>
  );
};
