import searchIcon from "../../assets/icon-search.svg";
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
  onSearchQueryChange: (value: string) => void;
  onSortByChange: (value: SortOption) => void;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}

function TasksToolbar({
  searchQuery,
  sortBy,
  priorityFilter,
  statusFilter,
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
        <span className="tasks-page__select-label">Sort</span>
        <select
          className="tasks-page__select"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as SortOption)}
        >
          <option value="due-date">Due date</option>
          <option value="priority">Priority</option>
          <option value="created">Created</option>
        </select>
      </div>

      <div className="tasks-page__select-group">
        <span className="tasks-page__select-label">Priority</span>
        <select
          className="tasks-page__select"
          value={priorityFilter}
          onChange={(event) => onPriorityFilterChange(event.target.value as PriorityFilter)}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="tasks-page__select-group">
        <span className="tasks-page__select-label">Status</span>
        <select
          className="tasks-page__select"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button className="tasks-page__new-task-btn">New task</button>
    </div>
  );
}

export default TasksToolbar;
