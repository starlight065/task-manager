import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./styles/App.css";
import calendarIcon from "./assets/calendar.svg";
import fileIcon from "./assets/file-icon.svg";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TasksPage from "./pages/TasksPage";
import { getCurrentUser } from "./api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

function ProtectedRoute({
  children,
  authStatus,
}: {
  children: React.ReactNode;
  authStatus: AuthStatus;
}) {
  if (authStatus === "loading") {
    return null;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({
  children,
  authStatus,
}: {
  children: React.ReactNode;
  authStatus: AuthStatus;
}) {
  if (authStatus === "loading") {
    return null;
  }

  if (authStatus === "authenticated") {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className="header__logo">Task Manager</h1>
          <p className="header__tagline">Your Personal Productivity Partner</p>
          <div className="button-group">
            <button
              className="button button--primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button button--secondary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="section">
          <h2 className="section__title">About This Project</h2>
          <p>
            This Task Manager is a powerful tool designed to help you organize
            your life, track your responsibilities, and boost your productivity.
            Whether you&apos;re managing personal errands, academic deadlines,
            or professional projects, our application provides the features you
            need to stay on top of everything.
          </p>
          <p>
            Our goal is to offer a clean, intuitive, and efficient user
            experience, allowing you to focus on what truly matters: getting
            things done.
          </p>
        </section>

        <section className="section">
          <h2 className="section__title">Key Features</h2>
          <div className="features">
            <div className="features__item">
              <h3 className="features__title">Task Creation</h3>
              <p>
                Easily create tasks with titles, detailed descriptions, and due
                dates.
              </p>
              <img src={calendarIcon} alt="Calendar" className="features__icon" />
            </div>
            <div className="features__item">
              <h3 className="features__title">Priority Levels</h3>
              <p>
                Assign priorities to focus on what&apos;s most important:
              </p>
              <div className="priority">
                <span className="priority__item priority__item--high">High</span>
                <span className="priority__item priority__item--medium">Medium</span>
                <span className="priority__item priority__item--low">Low</span>
              </div>
            </div>
            <div className="features__item">
              <h3 className="features__title">File Attachments</h3>
              <p>
                Attach files to your tasks to keep all relevant information in
                one place.
              </p>
              <img src={fileIcon} alt="File" className="features__icon" />
            </div>
            <div className="features__item">
              <h3 className="features__title">Secure Authentication</h3>
              <p>
                Your data is protected with a secure login and registration
                system.
              </p>
            </div>
            <div className="features__item">
              <h3 className="features__title">Sorting and Filtering</h3>
              <p>
                Quickly find tasks by sorting them by due date, priority, or
                creation date.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--last">
          <h2 className="section__title">Ready to Get Started?</h2>
          <p>
            Sign up for a free account today and take the first step towards a
            more organized life.
          </p>
          <div className="button-group">
            <button
              className="button button--secondary"
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    // Re-check the server session on reload so auth survives closing the tab.
    void (async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setAuthStatus(user ? "authenticated" : "unauthenticated");
        }
      } catch {
        if (isMounted) {
          setAuthStatus("unauthenticated");
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute authStatus={authStatus}>
            <LoginPage onAuthenticated={() => setAuthStatus("authenticated")} />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute authStatus={authStatus}>
            <SignupPage onAuthenticated={() => setAuthStatus("authenticated")} />
          </PublicRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute authStatus={authStatus}>
            <TasksPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
