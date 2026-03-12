import searchIcon from "../../assets/icon-search.svg";
import AppSelect, { type SelectOption } from "../shared/AppSelect";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
} from "../../features/tasks/taskFilters";

interface TasksToolbarProps {
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

const SORT_OPTIONS: SelectOption<SortOption>[] = [
  { value: "due-date", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Created" },
];

const PRIORITY_FILTER_OPTIONS: SelectOption<PriorityFilter>[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_FILTER_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

function TasksToolbar({
  searchQuery,
  sortBy,
  priorityFilter,
  statusFilter,
  onCreateTaskClick,
  onSearchQueryChange,
  onSortByChange,
  onPriorityFilterChange,
  onStatusFilterChange,
}: TasksToolbarProps) {
  return (
    <div className="tasks-page__toolbar">
      <div className="tasks-page__search-wrapper">
        <input
          type="text"
          className="tasks-page__search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
        <span className="tasks-page__search-icon">
          <img src={searchIcon} alt="" width="15" height="15" />
        </span>
      </div>

      <div className="tasks-page__select-group">
        <label className="tasks-page__select-label" htmlFor="tasks-sort-select">
          Sort
        </label>
        <AppSelect
          inputId="tasks-sort-select"
          options={SORT_OPTIONS}
          size="compact"
          value={sortBy}
          onChange={onSortByChange}
        />
      </div>

      <div className="tasks-page__select-group">
        <label className="tasks-page__select-label" htmlFor="tasks-priority-select">
          Priority
        </label>
        <AppSelect
          inputId="tasks-priority-select"
          options={PRIORITY_FILTER_OPTIONS}
          size="compact"
          value={priorityFilter}
          onChange={onPriorityFilterChange}
        />
      </div>

      <div className="tasks-page__select-group">
        <label className="tasks-page__select-label" htmlFor="tasks-status-select">
          Status
        </label>
        <AppSelect
          inputId="tasks-status-select"
          options={STATUS_FILTER_OPTIONS}
          size="compact"
          value={statusFilter}
          onChange={onStatusFilterChange}
        />
      </div>

      <button type="button" className="tasks-page__new-task-btn" onClick={onCreateTaskClick}>
        New task
      </button>
    </div>
  );
}

export default TasksToolbar;
