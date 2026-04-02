import type { SubmitEvent } from "react";
import type { CreateTaskDto, Priority, TaskDto } from "../../../shared/types";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
  TaskFormErrors,
  TasksPageModel,
} from "./model";

export interface CreateTaskModalProps {
  readonly isOpen: boolean;
  readonly mode: "create" | "edit";
  readonly formValues: CreateTaskDto;
  readonly fieldErrors: TaskFormErrors;
  readonly formError: string | null;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onFieldChange: (field: keyof CreateTaskDto, value: string) => void;
  readonly onSubtaskAdd: (title: string) => void;
  readonly onSubtaskRemove: (index: number) => void;
  readonly onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export type TaskCardCheckboxMode = "complete" | "select";

export interface TaskCardProps {
  task: TaskDto;
  isUpdating: boolean;
  checkboxMode: TaskCardCheckboxMode;
  isSelected?: boolean;
  onCompletionChange: (taskId: number, completed: boolean) => void;
  onSelectionChange?: (taskId: number, selected: boolean) => void;
  onSubtaskCompletionChange: (taskId: number, subtaskId: number, completed: boolean) => void;
  onEditClick: (task: TaskDto) => void;
  onDeleteClick: (task: TaskDto) => void;
  onShareClick: (task: TaskDto) => void;
  onShareRevokeClick: (task: TaskDto) => void;
}


export interface TaskDeleteModalProps {
  isOpen: boolean;
  taskTitle: string;
  taskCount: number;
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
  selectedTaskIds: number[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
  onTaskSelectionChange: (taskId: number, selected: boolean) => void;
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

export interface TasksBulkActionBarProps {
  selectedCount: number;
  selectedTasks: TaskDto[];
  canUpdateCompletion: boolean;
  isPending: boolean;
  completionAction: "complete" | "activate";
  onUpdateCompletion: () => Promise<boolean>;
  onDelete: () => void;
  onClearSelection: () => void;
  onApplyPriority: (priority: Priority) => Promise<boolean>;
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
