import classNames from "classnames";
import { useState } from "react";
import type { TaskDto } from "../../../shared/types";
import TaskCard from "./TaskCard";
import {
  addMonths,
  formatIsoDate,
  getCalendarMonth,
  getFirstSelectableDate,
  getMonthGrid,
  getMonthLabel,
  getTodayIsoDate,
  getTodayParts,
  isSameCalendarMonth,
  toIsoDate,
  WEEKDAY_LABELS,
} from "../lib/calendarDate";
import type { TasksCalendarViewProps } from "../types/components";
import type { CalendarMonth } from "../types/calendar";

const PRIORITY_ORDER: Record<TaskDto["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortTasksForCalendar(tasks: TaskDto[]): TaskDto[] {
  return [...tasks].sort((left, right) => {
    return (
      Number(left.completed) - Number(right.completed) ||
      PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority] ||
      left.title.localeCompare(right.title) ||
      left.id - right.id
    );
  });
}

function getTasksByDate(tasks: TaskDto[]): Map<string, TaskDto[]> {
  const groupedTasks = new Map<string, TaskDto[]>();

  tasks.forEach((task) => {
    if (!task.dueDate) {
      return;
    }

    const currentTasks = groupedTasks.get(task.dueDate) ?? [];
    currentTasks.push(task);
    groupedTasks.set(task.dueDate, currentTasks);
  });

  groupedTasks.forEach((dayTasks, isoDate) => {
    groupedTasks.set(isoDate, sortTasksForCalendar(dayTasks));
  });

  return groupedTasks;
}

function TasksCalendarView({ model }: TasksCalendarViewProps) {
  const todayParts = getTodayParts();
  const todayIsoDate = getTodayIsoDate();
  const todayMonth = getCalendarMonth(todayParts);
  const tasksByDate = getTasksByDate(model.tasks);
  const dueDates = [...tasksByDate.keys()];
  const [visibleMonth, setVisibleMonth] = useState<CalendarMonth>(todayMonth);
  const [selectedDate, setSelectedDate] = useState(() => todayIsoDate);

  const calendarDays = getMonthGrid(visibleMonth).map((parts) => {
    const isoDate = toIsoDate(parts);

    return {
      isoDate,
      dayNumber: parts.day,
      inCurrentMonth:
        parts.year === visibleMonth.year && parts.month === visibleMonth.month,
      isToday: isoDate === todayIsoDate,
      isSelected: isoDate === selectedDate,
      tasks: tasksByDate.get(isoDate) ?? [],
      month: parts.month,
      year: parts.year,
    };
  });
  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const selectedDateLabel = formatIsoDate(
    selectedDate,
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
  const selectedDateShortLabel = formatIsoDate(
    selectedDate,
    {
      month: "long",
      day: "numeric",
    },
  );

  function selectMonth(nextMonth: CalendarMonth) {
    setVisibleMonth(nextMonth);

    if (isSameCalendarMonth(nextMonth, todayMonth)) {
      setSelectedDate(todayIsoDate);
      return;
    }

    setSelectedDate(getFirstSelectableDate(nextMonth, dueDates));
  }

  function handleDaySelect(isoDate: string, year: number, month: number) {
    setSelectedDate(isoDate);

    if (year !== visibleMonth.year || month !== visibleMonth.month) {
      setVisibleMonth({ year, month });
    }
  }

  return (
    <section className="tasks-page__calendar">
      <div className="tasks-page__calendar-controls">
        <div>
          <h2 className="tasks-page__calendar-title">{getMonthLabel(visibleMonth)}</h2>
          <p className="tasks-page__calendar-subtitle">
            Click a day to review the tasks due then.
          </p>
        </div>

        <div className="tasks-page__calendar-actions">
          <button
            type="button"
            className="tasks-page__calendar-nav-button"
            onClick={() => selectMonth(addMonths(visibleMonth, -1))}
            aria-label="Show previous month"
          >
            Prev
          </button>
          <button
            type="button"
            className="tasks-page__calendar-nav-button"
            onClick={() => selectMonth(todayMonth)}
          >
            Today
          </button>
          <button
            type="button"
            className="tasks-page__calendar-nav-button"
            onClick={() => selectMonth(addMonths(visibleMonth, 1))}
            aria-label="Show next month"
          >
            Next
          </button>
          <button
            type="button"
            className="tasks-page__new-task-btn tasks-page__new-task-btn--calendar"
            onClick={model.openCreateTaskModal}
          >
            New task
          </button>
        </div>
      </div>

      <div className="tasks-page__calendar-layout">
        <div className="tasks-page__calendar-board">
          <div className="tasks-page__calendar-weekdays" aria-hidden="true">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="tasks-page__calendar-weekday">
                {label}
              </span>
            ))}
          </div>

          <div className="tasks-page__calendar-grid">
            {calendarDays.map((day) => (
              <button
                key={day.isoDate}
                type="button"
                className={classNames("tasks-page__calendar-day", {
                  "tasks-page__calendar-day--outside": !day.inCurrentMonth,
                  "tasks-page__calendar-day--today": day.isToday,
                  "tasks-page__calendar-day--selected": day.isSelected,
                  "tasks-page__calendar-day--has-tasks": day.tasks.length > 0,
                })}
                onClick={() => handleDaySelect(day.isoDate, day.year, day.month)}
                aria-pressed={day.isSelected}
              >
                <span className="tasks-page__calendar-day-number">{day.dayNumber}</span>
                <span className="tasks-page__calendar-day-content">
                  <span className="tasks-page__calendar-task-preview">
                    {day.tasks.slice(0, 2).map((task) => (
                      <span
                        key={task.id}
                        className={classNames("tasks-page__calendar-task-pill", {
                          "tasks-page__calendar-task-pill--completed": task.completed,
                        })}
                      >
                        {task.title}
                      </span>
                    ))}
                    {day.tasks.length > 2 ? (
                      <span className="tasks-page__calendar-task-more">
                        +{day.tasks.length - 2} more
                      </span>
                    ) : null}
                  </span>
                  {day.tasks.length > 0 ? (
                    <span className="tasks-page__calendar-task-count">
                      {day.tasks.length} due
                    </span>
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="tasks-page__calendar-panel" aria-live="polite">
          <div className="tasks-page__calendar-panel-header">
            <p className="tasks-page__calendar-panel-label">Selected day</p>
            <h3 className="tasks-page__calendar-panel-title">{selectedDateLabel}</h3>
            <p className="tasks-page__calendar-panel-count">
              {selectedTasks.length} task{selectedTasks.length === 1 ? "" : "s"} due
            </p>
          </div>

          {selectedTasks.length > 0 ? (
            <div className="tasks-page__calendar-task-list">
              {selectedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isUpdating={model.taskLists.pendingTaskIds.includes(task.id)}
                  onCompletionChange={model.taskLists.toggleTaskCompletion}
                  onSubtaskCompletionChange={model.taskLists.toggleSubtaskCompletion}
                  onEditClick={model.taskLists.openEditTaskModal}
                  onDeleteClick={model.taskLists.openDeleteTaskModal}
                />
              ))}
            </div>
          ) : (
            <div className="tasks-page__calendar-empty-state">
              No tasks due on {selectedDateShortLabel}.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default TasksCalendarView;
