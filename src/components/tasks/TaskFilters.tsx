import React from "react";
import { Typography } from "../core-ui/typography";
import { TaskStatus, TaskPriority, TaskType } from "@/types/task";
import { Input } from "../core-ui/input";
import { Select } from "../core-ui/select";
import { Button } from "../core-ui/button";
import { ArrowUp, ArrowDown, Filter, SortAsc, SortDesc } from "lucide-react";

interface TaskFiltersProps {
  filters: {
    search: string;
    status: TaskStatus | "";
    priority: TaskPriority | "";
    type: TaskType | "";
  };
  setFilters: (filters: {
    search: string;
    status: TaskStatus | "";
    priority: TaskPriority | "";
    type: TaskType | "";
  }) => void;
  sortBy: "dueDate" | "priority" | "createdAt";
  setSortBy: (field: "dueDate" | "priority" | "createdAt") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "", label: "All" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const typeOptions = [
  { value: "", label: "All" },
  { value: "feature", label: "Feature" },
  { value: "bug", label: "Bug" },
  { value: "improvement", label: "Improvement" },
];

const sortOptions = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "createdAt", label: "Created At" },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
        <div>
          <Typography variant='body' className='mb-2'>
            Search
          </Typography>
          <Input
            type='text'
            placeholder='Search tasks...'
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className='w-full'
          />
        </div>

        <div>
          <Typography variant='body' className='mb-2'>
            Status
          </Typography>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder='All'
          />
        </div>

        <div>
          <Typography variant='body' className='mb-2'>
            Priority
          </Typography>
          <Select
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => handleFilterChange("priority", value)}
            placeholder='All'
          />
        </div>

        <div>
          <Typography variant='body' className='mb-2'>
            Type
          </Typography>
          <Select
            options={typeOptions}
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            placeholder='All'
          />
        </div>

        <div>
          <Typography variant='body' className='mb-2'>
            Sort By
          </Typography>
          <div className='flex items-center gap-2'>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as typeof sortBy)}
              placeholder='Select sort field'
            />
            <Button
              variant='secondary'
              size='small'
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className='p-2'
            >
              {sortOrder === "asc" ? (
                <SortAsc className='w-4 h-4' />
              ) : (
                <SortDesc className='w-4 h-4' />
              )}
            </Button>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export { TaskFilters };
