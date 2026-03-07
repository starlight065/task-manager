import { useState } from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, X, AlertCircle } from "lucide-react";
import "../styles/AuthPages.css";
import { AUTH_ERRORS, PASSWORD_RULES } from "../constants/messages";
import { register } from "../api/auth";

interface SignupPageProps {
  onAuthenticated: () => void;
}

function SignupPage({ onAuthenticated }: SignupPageProps) {
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
      await register(email, password);
      onAuthenticated();
      navigate("/tasks");
    } catch (err) {
      setServerError(
        err instanceof Error && err.message
          ? err.message
          : AUTH_ERRORS.FETCH_FAILED_SIGNUP,
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
        <h1 className="auth__title">Create account</h1>

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={classNames("auth__input", {
              "auth__input--error": touched.email && !isEmailValid,
            })}
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
              className={classNames("auth__input", {
                "auth__input--error": touched.password && !isPasswordValid,
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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
              className={classNames("auth__rule", {
                "auth__rule--valid": hasMinLength,
              })}
            >
              {PASSWORD_RULES.MIN_LENGTH}
            </span>
            <span
              className={classNames("auth__rule", {
                "auth__rule--valid": hasSpecialChar,
              })}
            >
              {PASSWORD_RULES.SPECIAL_CHAR}
            </span>
          </div>
        </div>

        <button type="submit" className="auth__submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        <p className="auth__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth__link">
            Login
          </Link>
        </p>
      </form>

      {serverError &&
        createPortal(
          <div
            className="auth-modal__overlay"
            onClick={() => setServerError("")}
          >
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <div className="auth-modal__icon">
                <AlertCircle size={32} />
              </div>
              <h2 className="auth-modal__title">Signup failed</h2>
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

export default SignupPage;
