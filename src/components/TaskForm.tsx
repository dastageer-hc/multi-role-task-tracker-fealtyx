import React, { useState } from "react";
import { Task, TaskType, TaskStatus, TaskPriority } from "@/types/task";
import { statusConfig, priorityConfig } from "@/utils/taskConfig";
import { useTaskStore } from "@/store/taskStore";

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
  userRole: "manager" | "developer";
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onCancel,
  userRole,
}) => {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: "",
      description: "",
      type: "task",
      status: "open",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
      estimatedHours: 0,
      tags: [],
      comments: [],
      timeEntries: [],
      totalTimeSpent: 0,
      attachments: [],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData({ ...formData, tags });
  };

  const handleAcceptanceCriteriaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const criteria = e.target.value.split("\n").filter((line) => line.trim());
    setFormData({ ...formData, acceptanceCriteria: criteria });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dueDate) {
      return;
    }

    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: formData.title,
      description: formData.description,
      type: formData.type || "task",
      status: formData.status || "open",
      priority: formData.priority || "medium",
      dueDate: formData.dueDate,
      estimatedHours: formData.estimatedHours || 0,
      actualHours: formData.actualHours || 0,
      tags: formData.tags || [],
      comments: formData.comments || [],
      timeEntries: formData.timeEntries || [],
      totalTimeSpent: formData.totalTimeSpent || 0,
      attachments: formData.attachments || [],
      storyPoints: formData.storyPoints,
      acceptanceCriteria: formData.acceptanceCriteria,
      testCases: formData.testCases,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Basic Fields */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>Title</label>
        <input
          type='text'
          name='title'
          value={formData.title || ""}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Description
        </label>
        <textarea
          name='description'
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Type
          </label>
          <select
            name='type'
            value={formData.type || "task"}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value='task'>Task</option>
            <option value='bug'>Bug</option>
            <option value='feature'>Feature</option>
            <option value='epic'>Epic</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Priority
          </label>
          <select
            name='priority'
            value={formData.priority || "medium"}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            {Object.entries(priorityConfig).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!task && (
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Status
          </label>
          <select
            name='status'
            value={formData.status || "open"}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            {Object.entries(statusConfig).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Due Date
        </label>
        <input
          type='date'
          name='dueDate'
          value={formData.dueDate?.split("T")[0] || ""}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Estimated Hours
        </label>
        <input
          type='number'
          name='estimatedHours'
          value={formData.estimatedHours || ""}
          onChange={handleChange}
          min='0'
          step='0.5'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Tags (comma-separated)
        </label>
        <input
          type='text'
          name='tags'
          value={formData.tags?.join(", ") || ""}
          onChange={handleTagsChange}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          placeholder='e.g., frontend, bug, urgent'
        />
      </div>

      {/* Advanced Fields Toggle */}
      <div className='flex items-center justify-between'>
        <button
          type='button'
          onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          className='text-sm text-blue-600 hover:text-blue-800'
        >
          {showAdvancedFields ? "Hide Advanced Fields" : "Show Advanced Fields"}
        </button>
      </div>

      {/* Advanced Fields */}
      {showAdvancedFields && (
        <div className='space-y-4 border-t pt-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Story Points
            </label>
            <input
              type='number'
              name='storyPoints'
              value={formData.storyPoints || ""}
              onChange={handleChange}
              min='0'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Acceptance Criteria
            </label>
            <textarea
              name='acceptanceCriteria'
              value={formData.acceptanceCriteria?.join("\n") || ""}
              onChange={handleAcceptanceCriteriaChange}
              rows={3}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              placeholder='Enter each criterion on a new line'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Test Cases
            </label>
            <textarea
              name='testCases'
              value={formData.testCases?.join("\n") || ""}
              onChange={(e) => {
                const testCases = e.target.value
                  .split("\n")
                  .filter((line) => line.trim());
                setFormData({ ...formData, testCases });
              }}
              rows={3}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              placeholder='Enter each test case on a new line'
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          {task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};
