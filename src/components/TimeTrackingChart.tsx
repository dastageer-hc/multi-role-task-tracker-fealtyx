import React from "react";
import { Card } from "./core-ui/card";
import { Typography } from "./core-ui/typography";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimeTrackingChartProps {
  timeEntries: {
    date: string;
    hours: number;
  }[];
  isManager: boolean;
}

export const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({
  timeEntries = [],
  isManager,
}) => {
  // Group time entries by date and sum hours
  const groupedEntries = timeEntries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += entry.hours;
    return acc;
  }, {} as Record<string, number>);

  // Sort dates and get the last 7 entries
  const sortedDates = Object.keys(groupedEntries).sort();
  const last7Dates = sortedDates.slice(-7);
  const last7Hours = last7Dates.map((date) => groupedEntries[date]);

  const totalHours = Object.values(groupedEntries).reduce(
    (sum, hours) => sum + hours,
    0
  );
  const averageHours =
    last7Dates.length > 0 ? totalHours / last7Dates.length : 0;

  const chartData = {
    labels: last7Dates,
    datasets: [
      {
        label: "Hours Worked",
        data: last7Hours,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Time Tracking Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Typography variant='h2'>Time Tracking</Typography>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card padding='md'>
          <Typography variant='h3' className='mb-2'>
            Overview
          </Typography>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Typography variant='body' tone='muted'>
                Total Hours
              </Typography>
              <Typography variant='body' className='font-medium'>
                {totalHours.toFixed(1)}h
              </Typography>
            </div>
            <div className='flex justify-between'>
              <Typography variant='body' tone='muted'>
                Average Hours/Day
              </Typography>
              <Typography variant='body' className='font-medium'>
                {averageHours.toFixed(1)}h
              </Typography>
            </div>
          </div>
        </Card>
        {isManager && (
          <Card padding='md'>
            <Typography variant='h3' className='mb-4'>
              Detailed Analysis
            </Typography>
            <div className='h-[300px]'>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
