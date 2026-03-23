import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import { useState, type SubmitEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { AuthFormMode, AuthFormProps } from "../types";
import {
  AUTH_MESSAGES,
  PASSWORD_RULES,
  validateAuthCredentials,
} from "../utils/authValidation";

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

  const emailError = touched.email && !validation.isEmailValid;
  const passwordError = touched.password && !validation.isPasswordValid;

  return (
    <>
      <div className="auth-page">
        <Button
          className="auth-page__back-link"
          component={RouterLink}
          disabled={isLoading}
          to="/"
          variant="text"
        >
          Back to Home
        </Button>

        <Card className="auth-page__card" elevation={8}>
          <CardContent className="auth-page__card-content">
            <form className="auth-page__form" noValidate onSubmit={handleSubmit}>
              <div className="auth-page__intro">
                <h1 className="auth-page__title">{copy.title}</h1>
                <p className="auth-page__subtitle">Use your email and password to continue.</p>
              </div>

              <TextField
                autoComplete="email"
                autoFocus
                disabled={isLoading}
                error={emailError}
                fullWidth
                helperText={emailError ? AUTH_MESSAGES.emailInvalid : " "}
                id="email"
                label="Email"
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onBlur={() => setTouched((currentTouched) => ({ ...currentTouched, email: true }))}
                onChange={(event) => setEmail(event.target.value)}
              />

              <div className="auth-page__password-group">
                <TextField
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  disabled={isLoading}
                  error={passwordError}
                  fullWidth
                  helperText={passwordError ? "Password must meet both requirements below." : " "}
                  id="password"
                  label="Password"
                  placeholder={copy.passwordPlaceholder}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={() =>
                    setTouched((currentTouched) => ({ ...currentTouched, password: true }))
                  }
                  onChange={(event) => setPassword(event.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            disabled={isLoading}
                            size="small"
                            type="button"
                            onClick={() => setShowPassword((currentValue) => !currentValue)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <div className="auth-page__password-rules">
                  <Chip
                    color={validation.hasMinLength ? "success" : "default"}
                    label={PASSWORD_RULES.minLength}
                    size="small"
                    variant={validation.hasMinLength ? "filled" : "outlined"}
                  />
                  <Chip
                    color={validation.hasSpecialCharacter ? "success" : "default"}
                    label={PASSWORD_RULES.specialCharacter}
                    size="small"
                    variant={validation.hasSpecialCharacter ? "filled" : "outlined"}
                  />
                </div>
              </div>

              <Button disabled={isLoading} size="large" type="submit" variant="contained">
                {isLoading ? "Loading..." : copy.submitLabel}
              </Button>

              <p className="auth-page__footer">
                {copy.footerPrompt}{" "}
                <Link
                  className="auth-page__footer-link"
                  component={RouterLink}
                  to={copy.footerLinkTo}
                  underline="hover"
                >
                  {copy.footerLinkLabel}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog
        aria-labelledby="auth-error-title"
        fullWidth
        maxWidth="xs"
        open={Boolean(serverError)}
        slotProps={{ paper: { className: "app-dialog" } }}
        onClose={() => setServerError("")}
      >
        <DialogTitle className="app-dialog__title" id="auth-error-title">
          {copy.errorTitle}
        </DialogTitle>
        <DialogContent className="app-dialog__content">
          <p className="app-dialog__subdued-text">{serverError}</p>
        </DialogContent>
        <DialogActions className="app-dialog__actions">
          <Button type="button" variant="contained" onClick={() => setServerError("")}>
            Try again
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AuthForm;
