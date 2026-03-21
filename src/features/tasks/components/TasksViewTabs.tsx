import classNames from "classnames";
import { NavLink } from "react-router-dom";

function TasksViewTabs() {
  return (
    <nav className="tasks-page__tabs" aria-label="Task views">
      <NavLink
        end
        to="/tasks"
        className={({ isActive }) =>
          classNames("tasks-page__tab", { "tasks-page__tab--active": isActive })
        }
      >
        List
      </NavLink>
      <NavLink
        to="/tasks/calendar"
        className={({ isActive }) =>
          classNames("tasks-page__tab", { "tasks-page__tab--active": isActive })
        }
      >
        Calendar
      </NavLink>
    </nav>
  );
}

export default TasksViewTabs;
