import "./App.css";
import calendarIcon from "./assets/calendar.svg";
import fileIcon from "./assets/file-icon.svg";

function App() {
  return (
    <>
      <header className="header">
        <div className="header__container">
          <h1 className="header__logo">Task Manager</h1>
          <p className="header__tagline">Your Personal Productivity Partner</p>
          <div className="button-group">
            <button
              className="button button--primary"
              onClick={() => (window.location.href = "/frontend/login.html")}
            >
              Login
            </button>
            <button
              className="button button--primary"
              onClick={() => (window.location.href = "/frontend/signup.html")}
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
              onClick={() => (window.location.href = "/frontend/signup.html")}
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
