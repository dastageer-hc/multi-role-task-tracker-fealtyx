import React from "react";
import { Typography } from "../core-ui/typography";
import { Input } from "../core-ui/input";
import { Select } from "../core-ui/select";
import { Task, TaskStatus, TaskPriority, TaskType } from "@/types/task";

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const typeOptions = [
  { value: "feature", label: "Feature" },
  { value: "bug", label: "Bug" },
  { value: "improvement", label: "Improvement" },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  task = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<Partial<Task>>({
    title: task.title || "",
    description: task.description || "",
    status: task.status || ("todo" as TaskStatus),
    priority: task.priority || "medium",
    type: task.type || "feature",
    dueDate: task.dueDate || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Typography variant='body' tone='muted' className='mb-2'>
          Title
        </Typography>
        <Input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='Enter task title'
          required
        />
      </div>

      <div>
        <Typography variant='body' tone='muted' className='mb-2'>
          Description
        </Typography>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Enter task description'
          className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          rows={4}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Typography variant='body' tone='muted' className='mb-2'>
            Status
          </Typography>
          <Select
            options={statusOptions}
            value={formData.status || ""}
            onChange={(value) =>
              setFormData({ ...formData, status: value as TaskStatus })
            }
            placeholder='Select status'
          />
        </div>

        <div>
          <Typography variant='body' tone='muted' className='mb-2'>
            Priority
          </Typography>
          <Select
            options={priorityOptions}
            value={formData.priority || ""}
            onChange={(value) =>
              setFormData({ ...formData, priority: value as TaskPriority })
            }
            placeholder='Select priority'
          />
        </div>

        <div>
          <Typography variant='body' tone='muted' className='mb-2'>
            Type
          </Typography>
          <Select
            options={typeOptions}
            value={formData.type || ""}
            onChange={(value) =>
              setFormData({ ...formData, type: value as TaskType })
            }
            placeholder='Select type'
          />
        </div>

        <div>
          <Typography variant='body' tone='muted' className='mb-2'>
            Due Date
          </Typography>
          <Input
            type='date'
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 text-gray-600 hover:text-gray-800'
        >
          <Typography variant='body'>Cancel</Typography>
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <Typography variant='body' tone='white'>
            {task.id ? "Update Task" : "Create Task"}
          </Typography>
        </button>
      </div>
    </form>
  );
};
