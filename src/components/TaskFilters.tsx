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
  filters: TaskFiltersType;
  setFilters: (
    filters: TaskFiltersType | ((prev: TaskFiltersType) => TaskFiltersType)
  ) => void;
  sortBy: "dueDate" | "priority" | "createdAt";
  setSortBy: (sortBy: "dueDate" | "priority" | "createdAt") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (sortOrder: "asc" | "desc") => void;
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
    <div className='bg-white rounded-lg shadow-sm p-4 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Search
          </Typography>
          <Input
            type='text'
            placeholder='Search tasks...'
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Status
          </Typography>
          <Select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value as TaskStatus,
              }))
            }
            options={[
              { value: "", label: "All" },
              { value: "todo", label: "To Do" },
              { value: "in_progress", label: "In Progress" },
              { value: "review", label: "Review" },
              { value: "done", label: "Done" },
            ]}
          />
        </div>

        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Priority
          </Typography>
          <Select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priority: e.target.value as TaskPriority,
              }))
            }
            options={[
              { value: "", label: "All" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
        </div>

        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Type
          </Typography>
          <Select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value as TaskType,
              }))
            }
            options={[
              { value: "", label: "All" },
              { value: "task", label: "Task" },
              { value: "bug", label: "Bug" },
              { value: "feature", label: "Feature" },
              { value: "epic", label: "Epic" },
            ]}
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Sort By
          </Typography>
          <Select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "dueDate" | "priority" | "createdAt")
            }
            options={[
              { value: "dueDate", label: "Due Date" },
              { value: "priority", label: "Priority" },
              { value: "createdAt", label: "Created At" },
            ]}
          />
        </div>

        <div>
          <Typography variant='body-sm' tone='muted' className='mb-2'>
            Order
          </Typography>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
