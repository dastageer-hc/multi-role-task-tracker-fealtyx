import React from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { statusConfig, priorityConfig } from "../utils/taskConfig";
import { Input } from "./core-ui/input";
import { Select } from "./core-ui/select";
import { Typography } from "./core-ui/typography";
import {
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskFilters as TaskFiltersType,
} from "@/types/task";

interface TaskFiltersProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    type: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string;
      status: string;
      priority: string;
      type: string;
    }>
  >;
  sortBy: "dueDate" | "priority" | "createdAt";
  setSortBy: (value: "dueDate" | "priority" | "createdAt") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Filter size={16} className='text-gray-500' />
        <Typography variant='label' tone='muted'>
          Filters & Sorting
        </Typography>
      </div>
      <div className='flex flex-wrap gap-4 items-center'>
        <div className='flex-1 min-w-64'>
          <Input
            icon={<Search size={16} className='text-gray-400' />}
            placeholder='Search tasks...'
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <Select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          options={[
            { value: "", label: "All Status" },
            ...Object.entries(statusConfig).map(([key, config]) => ({
              value: key,
              label: config.label,
            })),
          ]}
          className='w-[20rem]'
        />

        <Select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          options={[
            { value: "", label: "All Priority" },
            ...Object.entries(priorityConfig).map(([key, config]) => ({
              value: key,
              label: config.label,
            })),
          ]}
        />

        <Select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          options={[
            { value: "", label: "All Types" },
            { value: "task", label: "Task" },
            { value: "bug", label: "Bug" },
            { value: "feature", label: "Feature" },
            { value: "epic", label: "Epic" },
          ]}
        />

        <div className='flex gap-2'>
          <Select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "dueDate" | "priority" | "createdAt")
            }
            options={[
              { value: "dueDate", label: "Due Date" },
              { value: "priority", label: "Priority" },
              { value: "createdAt", label: "Created" },
            ]}
          />
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50'
          >
            <ArrowUpDown
              size={16}
              className={sortOrder === "asc" ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
