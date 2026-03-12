import { useState, type SubmitEvent } from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "../../../styles/AuthPages.css";
import type { AuthCredentials } from "../../../shared/types";
import alertCircleIcon from "../../../assets/auth-alert-circle.svg";
import arrowLeftIcon from "../../../assets/auth-arrow-left.svg";
import closeIcon from "../../../assets/auth-close.svg";
import eyeIcon from "../../../assets/auth-eye.svg";
import eyeOffIcon from "../../../assets/auth-eye-off.svg";
import {
  AUTH_MESSAGES,
  PASSWORD_RULES,
  validateAuthCredentials,
} from "../utils/authValidation";

type AuthFormMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthFormMode;
  onSubmit: (credentials: AuthCredentials) => Promise<void>;
}

const FORM_COPY: Record<
  AuthFormMode,
  {
    title: string;
    submitLabel: string;
    passwordPlaceholder: string;
    footerPrompt: string;
    footerLinkLabel: string;
    footerLinkTo: string;
    errorTitle: string;
    networkErrorMessage: string;
  }
> = {
  login: {
    title: "Welcome back",
    submitLabel: "Login",
    passwordPlaceholder: "Enter your password",
    footerPrompt: "Don't have an account yet?",
    footerLinkLabel: "Signup",
    footerLinkTo: "/signup",
    errorTitle: "Login failed",
    networkErrorMessage: AUTH_MESSAGES.loginNetworkError,
  },
  signup: {
    title: "Create account",
    submitLabel: "Sign Up",
    passwordPlaceholder: "Create a password",
    footerPrompt: "Already have an account?",
    footerLinkLabel: "Login",
    footerLinkTo: "/login",
    errorTitle: "Signup failed",
    networkErrorMessage: AUTH_MESSAGES.signupNetworkError,
  },
};

function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const copy = FORM_COPY[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validation = validateAuthCredentials(email, password);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setServerError("");

    if (!validation.isEmailValid || !validation.isPasswordValid) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({ email, password });
    } catch (error) {
      setServerError(
        error instanceof Error && error.message ? error.message : copy.networkErrorMessage,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth">
      <Link to="/" className="auth__home">
        <img className="auth__icon auth__icon--sm" src={arrowLeftIcon} alt="" />
        Home
      </Link>
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__title">{copy.title}</h1>

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={classNames("auth__input", {
              "auth__input--error": touched.email && !validation.isEmailValid,
            })}
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setTouched((currentTouched) => ({ ...currentTouched, email: true }))}
          />
          {touched.email && !validation.isEmailValid ? (
            <span className="auth__error">{AUTH_MESSAGES.emailInvalid}</span>
          ) : null}
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="password">
            Password
          </label>
          <div className="auth__input-wrapper">
            <input
              id="password"
              className={classNames("auth__input", {
                "auth__input--error": touched.password && !validation.isPasswordValid,
              })}
              type={showPassword ? "text" : "password"}
              placeholder={copy.passwordPlaceholder}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() =>
                setTouched((currentTouched) => ({ ...currentTouched, password: true }))
              }
            />
            <button
              type="button"
              className="auth__eye"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
            >
              <img
                className="auth__icon auth__icon--sm"
                src={showPassword ? eyeOffIcon : eyeIcon}
                alt=""
              />
            </button>
          </div>
          <div className="auth__rules">
            <span
              className={classNames("auth__rule", {
                "auth__rule--valid": validation.hasMinLength,
              })}
            >
              {PASSWORD_RULES.minLength}
            </span>
            <span
              className={classNames("auth__rule", {
                "auth__rule--valid": validation.hasSpecialCharacter,
              })}
            >
              {PASSWORD_RULES.specialCharacter}
            </span>
          </div>
        </div>

        <button type="submit" className="auth__submit" disabled={isLoading}>
          {isLoading ? "Loading..." : copy.submitLabel}
        </button>

        <p className="auth__footer">
          {copy.footerPrompt}{" "}
          <Link to={copy.footerLinkTo} className="auth__link">
            {copy.footerLinkLabel}
          </Link>
        </p>
      </form>

      {serverError
        ? createPortal(
            <div className="auth-modal__overlay" onClick={() => setServerError("")}>
              <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
                <div className="auth-modal__icon">
                  <img
                    className="auth__icon auth__icon--lg"
                    src={alertCircleIcon}
                    alt=""
                  />
                </div>
                <h2 className="auth-modal__title">{copy.errorTitle}</h2>
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
                  <img
                    className="auth__icon auth__icon--xs"
                    src={closeIcon}
                    alt=""
                  />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export default AuthForm;
