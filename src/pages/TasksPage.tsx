import "../styles/TasksPage.css";
import type { Task } from "../types/Task";
import MOCK_TASKS from "../data/mockTasks";
import editIcon from "../assets/icon-edit.svg";
import trashIcon from "../assets/icon-trash.svg";
import searchIcon from "../assets/icon-search.svg";

function dueDateClass(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "task-card__due-date--overdue";
  if (diffDays <= 4) return "task-card__due-date--soon";
  return "task-card__due-date--normal";
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="task-card">
      <input
        type="checkbox"
        className="task-card__checkbox"
        defaultChecked={task.completed}
        readOnly
      />
      <div className="task-card__content">
        <div className={`task-card__title${task.completed ? " task-card__title--completed" : ""}`}>
          {task.title}
        </div>
        <div className="task-card__description">{task.description}</div>
      </div>
      <div className="task-card__actions">
        <button className="task-card__action" aria-label="Edit task">
          <img src={editIcon} alt="" width="16" height="16" />
        </button>
        <button className="task-card__action" aria-label="Delete task">
          <img src={trashIcon} alt="" width="16" height="16" />
        </button>
      </div>
      <div className="task-card__meta">
        <span className={`priority-badge priority-badge--${task.priority}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className={`task-card__due-date ${task.completed ? "task-card__due-date--overdue" : dueDateClass(task.dueDate)}`}>
          {task.dueDate}
        </span>
        <span className="tag-badge">{task.tag}</span>
      </div>
    </div>
  );
}

function TasksPage() {
  const activeTasks = MOCK_TASKS.filter((t) => !t.completed);
  const completedTasks = MOCK_TASKS.filter((t) => t.completed);
  const total = MOCK_TASKS.length;
  const done = completedTasks.length;
  const pending = activeTasks.length;
  const progressPct = Math.round((done / total) * 100);

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-page__header">
        <h1 className="tasks-page__title">
          Task manager <span>• March 2026</span>
        </h1>
        <div className="tasks-page__stats">
          <div className="tasks-page__stat">
            <span className="tasks-page__stat-value tasks-page__stat-value--pending">{pending}</span>
            <span className="tasks-page__stat-label">pending</span>
          </div>
          <div className="tasks-page__stat">
            <span className="tasks-page__stat-value tasks-page__stat-value--done">{done}</span>
            <span className="tasks-page__stat-label">done</span>
          </div>
          <div className="tasks-page__stat">
            <span className="tasks-page__stat-value tasks-page__stat-value--total">{total}</span>
            <span className="tasks-page__stat-label">total</span>
          </div>
        </div>
      </div>

      <hr className="tasks-page__header-divider" />

      {/* Toolbar */}
      <div className="tasks-page__toolbar">
        <div className="tasks-page__search-wrapper">
          <input
            type="text"
            className="tasks-page__search"
            placeholder="Search tasks..."
          />
          <span className="tasks-page__search-icon">
            <img src={searchIcon} alt="" width="15" height="15" />
          </span>
        </div>

        <div className="tasks-page__select-group">
          <span className="tasks-page__select-label">Sort</span>
          <select className="tasks-page__select" defaultValue="due-date">
            <option value="due-date">Due date</option>
            <option value="priority">Priority</option>
            <option value="created">Created</option>
          </select>
        </div>

        <div className="tasks-page__select-group">
          <span className="tasks-page__select-label">Priority</span>
          <select className="tasks-page__select" defaultValue="all">
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button className="tasks-page__new-task-btn">New task</button>
      </div>

      {/* Column headers — visible on desktop only via CSS */}
      <div className="tasks-page__col-headers">
        <div className="tasks-page__col-headers-check" />
        <div className="tasks-page__col-headers-content" />
        <div className="tasks-page__col-header tasks-page__col-header--priority">Priority</div>
        <div className="tasks-page__col-header tasks-page__col-header--date">Due Date</div>
        <div className="tasks-page__col-header tasks-page__col-header--tag">Tag</div>
        <div className="tasks-page__col-headers-actions" />
      </div>

      {/* Active tasks */}
      <div className="tasks-page__section-heading">
        Active: {activeTasks.length} tasks
      </div>
      {activeTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {/* Completed tasks */}
      <div className="tasks-page__section-heading">
        Completed: {completedTasks.length} tasks
      </div>
      {completedTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {/* Progress */}
      <div className="tasks-page__progress">
        <span className="tasks-page__progress-label">
          {done} / {total} completed
        </span>
        <div className="tasks-page__progress-bar-track">
          <div
            className="tasks-page__progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
