import type { SubmitEvent } from "react";
import type { CreateTaskDto, TaskDto } from "../../../shared/types";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
  TaskFormErrors,
  TasksPageModel,
} from "./model";

export interface CreateTaskModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formValues: CreateTaskDto;
  fieldErrors: TaskFormErrors;
  formError: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onFieldChange: (field: keyof CreateTaskDto, value: string) => void;
  onSubtaskAdd: (title: string) => void;
  onSubtaskRemove: (index: number) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export interface TaskCardProps {
  task: TaskDto;
  isUpdating: boolean;
  onCompletionChange: (taskId: number, completed: boolean) => void;
  onSubtaskCompletionChange: (taskId: number, subtaskId: number, completed: boolean) => void;
  onEditClick: (task: TaskDto) => void;
  onDeleteClick: (task: TaskDto) => void;
  onShareClick: (task: TaskDto) => void;
  onShareRevokeClick: (task: TaskDto) => void;
}


export interface TaskDeleteModalProps {
  isOpen: boolean;
  taskTitle: string;
  error: string | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface TaskErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export interface TaskListSectionProps {
  title: string;
  tasks: TaskDto[];
  pendingTaskIds: number[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
  onSubtaskCompletionChange: (taskId: number, subtaskId: number, completed: boolean) => void;
  onTaskEditClick: (task: TaskDto) => void;
  onTaskDeleteClick: (task: TaskDto) => void;
  onTaskShareClick: (task: TaskDto) => void;
  onTaskShareRevokeClick: (task: TaskDto) => void;
}


export interface TasksCalendarViewProps {
  model: TasksPageModel;
}

export interface TasksHeaderProps {
  pending: number;
  done: number;
  total: number;
  subtitle?: string;
}

export interface TasksListViewProps {
  model: TasksPageModel;
}

export interface TasksProgressProps {
  done: number;
  total: number;
  progressPct: number;
}

export interface TasksToolbarProps {
  searchQuery: string;
  sortBy: SortOption;
  priorityFilter: PriorityFilter;
  statusFilter: StatusFilter;
  onCreateTaskClick: () => void;
  onSearchQueryChange: (value: string) => void;
  onSortByChange: (value: SortOption) => void;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}
