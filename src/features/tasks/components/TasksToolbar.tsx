import { InputAdornment, MenuItem, TextField } from "@mui/material";
import searchIcon from "../../../assets/icon-search.svg";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
} from "../model/taskFilters";

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

const SORT_OPTIONS = [
  { value: "due-date", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Created" },
] satisfies ReadonlyArray<{ label: string; value: SortOption }>;

const PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] satisfies ReadonlyArray<{ label: string; value: PriorityFilter }>;

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] satisfies ReadonlyArray<{ label: string; value: StatusFilter }>;

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
        <TextField
          fullWidth
          id="tasks-search"
          label="Search"
          size="small"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <img src={searchIcon} alt="" width="15" height="15" />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div className="tasks-page__select-group tasks-page__select-group--sort">
        <TextField
          className="tasks-page__select-control"
          fullWidth
          id="tasks-sort-select"
          label="Sort"
          select
          size="small"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="tasks-page__select-group tasks-page__select-group--priority">
        <TextField
          className="tasks-page__select-control"
          fullWidth
          id="tasks-priority-select"
          label="Priority"
          select
          size="small"
          value={priorityFilter}
          onChange={(event) => onPriorityFilterChange(event.target.value as PriorityFilter)}
        >
          {PRIORITY_FILTER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="tasks-page__select-group tasks-page__select-group--status">
        <TextField
          className="tasks-page__select-control"
          fullWidth
          id="tasks-status-select"
          label="Status"
          select
          size="small"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <button type="button" className="tasks-page__new-task-btn" onClick={onCreateTaskClick}>
        New task
      </button>
    </div>
  );
}

export default TasksToolbar;
