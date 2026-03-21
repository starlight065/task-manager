import { useOutletContext } from "react-router-dom";
import TasksCalendarView from "../features/tasks/components/TasksCalendarView";
import type { TasksPageModel } from "../features/tasks/types/model";

function TasksCalendarPage() {
  const model = useOutletContext<TasksPageModel>();

  return <TasksCalendarView model={model} />;
}

export default TasksCalendarPage;
