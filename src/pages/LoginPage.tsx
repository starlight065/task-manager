import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X, AlertCircle } from "lucide-react";
import "../styles/AuthPages.css";
import { AUTH_ERRORS, PASSWORD_RULES } from "../constants/messages";
import { login } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = password.length >= 14;
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isPasswordValid = hasMinLength && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError("");

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      sessionStorage.setItem("authenticated", "true");
      navigate("/tasks");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : AUTH_ERRORS.FETCH_FAILED_LOGIN,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <Link to="/" className="auth__home">
        <ArrowLeft size={20} />
        Home
      </Link>
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__title">Welcome back</h1>

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={`auth__input ${touched.email && !isEmailValid ? "auth__input--error" : ""}`}
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && !isEmailValid && (
            <span className="auth__error">{AUTH_ERRORS.EMAIL_INVALID}</span>
          )}
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="password">
            Password
          </label>
          <div className="auth__input-wrapper">
            <input
              id="password"
              className={`auth__input ${touched.password && !isPasswordValid ? "auth__input--error" : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            <button
              type="button"
              className="auth__eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="auth__rules">
            <span
              className={`auth__rule ${hasMinLength ? "auth__rule--valid" : ""}`}
            >
              {PASSWORD_RULES.MIN_LENGTH}
            </span>
            <span
              className={`auth__rule ${hasSpecialChar ? "auth__rule--valid" : ""}`}
            >
              {PASSWORD_RULES.SPECIAL_CHAR}
            </span>
          </div>
        </div>

        <button type="submit" className="auth__submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>

        <p className="auth__footer">
          Don't have an account yet?{" "}
          <Link to="/signup" className="auth__link">
            Signup
          </Link>
        </p>
      </form>

      {serverError &&
        createPortal(
          <div
            className="auth-modal__overlay"
            onClick={() => setServerError("")}
          >
            <div
              className="auth-modal"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside it
            >
              <div className="auth-modal__icon">
                <AlertCircle size={32} />
              </div>
              <h2 className="auth-modal__title">Login failed</h2>
              <p className="auth-modal__message">{serverError}</p>
              <button
                className="auth-modal__close-btn"
                onClick={() => setServerError("")}
              >
                Try again
              </button>
              <button
                className="auth-modal__dismiss"
                onClick={() => setServerError("")}
                aria-label="Dismiss"
              >
                <X size={18} />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default LoginPage;
