import React from "react";

import type { TasksPageModel } from "../../tasks/types/model";
import SummaryCards from "./SummaryCards";
import PriorityBreakdownChart from "./PriorityBreakdownChart";
import DueDateStatusList from "./DueDateStatusList";
import TagBreakdownChart from "./TagBreakdownChart";
import "../styles/dashboard.scss";

interface TasksDashboardViewProps {
  model: TasksPageModel;
}

function TasksDashboardView({ model }: TasksDashboardViewProps) {
  const { tasks } = model;

  return (
    <div className="tasks-dashboard">
      <div className="tasks-dashboard__top">
        <SummaryCards tasks={tasks} />
      </div>
      
      <div className="tasks-dashboard__middle">
        <div className="tasks-dashboard__card tasks-dashboard__card--priority">
          <PriorityBreakdownChart tasks={tasks} />
        </div>
        <div className="tasks-dashboard__card tasks-dashboard__card--due-date">
          <DueDateStatusList tasks={tasks} />
        </div>
      </div>
      
      <div className="tasks-dashboard__bottom">
        <div className="tasks-dashboard__card tasks-dashboard__card--tags">
          <TagBreakdownChart tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default TasksDashboardView;
