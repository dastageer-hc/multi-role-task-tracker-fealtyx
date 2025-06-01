import React from "react";
import { Typography } from "../core-ui/typography";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Task } from "@/types/task";

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
  tasks: Task[];
}

export const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({
  tasks = [],
}) => {
  // Get the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  // Calculate concurrent tasks for each day
  const concurrentTasks = last7Days.map((date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
      return taskDate === date;
    }).length;
  });

  const chartData: ChartData<"line"> = {
    labels: last7Days.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Concurrent Tasks",
        data: concurrentTasks,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Concurrent Tasks Trend (Last 7 Days)",
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
    <div className='bg-white rounded-lg shadow-sm p-4'>
      <Typography variant='h3' className='mb-4'>
        Task Activity
      </Typography>
      <div className='h-[300px]'>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
