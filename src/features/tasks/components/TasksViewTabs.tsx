import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/useI18n";

function TasksViewTabs() {
  const { t } = useI18n();

  return (
    <nav className="tasks-page__tabs" aria-label={t("tasks.viewAriaLabel")}>
      <NavLink
        end
        to="/tasks"
        className={({ isActive }) =>
          classNames("tasks-page__tab", { "tasks-page__tab--active": isActive })
        }
      >
        {t("common.list")}
      </NavLink>
      <NavLink
        to="/tasks/calendar"
        className={({ isActive }) =>
          classNames("tasks-page__tab", { "tasks-page__tab--active": isActive })
        }
      >
        {t("common.calendar")}
      </NavLink>
      <NavLink
        to="/tasks/dashboard"
        className={({ isActive }) =>
          classNames("tasks-page__tab", { "tasks-page__tab--active": isActive })
        }
      >
        {t("common.dashboard")}
      </NavLink>
    </nav>
  );
}

export default TasksViewTabs;
