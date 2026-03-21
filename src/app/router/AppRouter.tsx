import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import HomePage from "../../pages/HomePage";
import SignupPage from "../../pages/SignupPage";
import TasksCalendarPage from "../../pages/TasksCalendarPage";
import TasksListPage from "../../pages/TasksListPage";
import TasksPage from "../../pages/TasksPage";
import { ProtectedRoute, PublicRoute } from "./RouteGuards";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<TasksListPage />} />
        <Route path="calendar" element={<TasksCalendarPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
