import {
  Box,
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
  Stack,
  TextField,
  Typography,
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
      <Box
        sx={{
          alignItems: "center",
          background:
            "radial-gradient(circle at top, rgba(0, 123, 255, 0.16), transparent 30%), #f8f9fa",
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
          px: 2,
          py: { sm: 4, xs: 10 },
          position: "relative",
        }}
      >
        <Button
          component={RouterLink}
          disabled={isLoading}
          to="/"
          variant="text"
          sx={{
            left: { sm: 24, xs: 16 },
            position: "absolute",
            top: { sm: 24, xs: 16 },
          }}
        >
          Back to Home
        </Button>

        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            maxWidth: 440,
            overflow: "visible",
            width: "100%",
          }}
        >
          <CardContent sx={{ p: { sm: 5, xs: 3 } }}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack spacing={1} textAlign="center">
                  <Typography component="h1" variant="h4" fontWeight={700}>
                    {copy.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Use your email and password to continue.
                  </Typography>
                </Stack>

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

                <Stack spacing={1.25}>
                  <TextField
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    disabled={isLoading}
                    error={passwordError}
                    fullWidth
                    helperText={
                      passwordError ? "Password must meet both requirements below." : " "
                    }
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

                  <Stack direction="row" flexWrap="wrap" gap={1}>
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
                  </Stack>
                </Stack>

                <Button disabled={isLoading} size="large" type="submit" variant="contained">
                  {isLoading ? "Loading..." : copy.submitLabel}
                </Button>

                <Typography color="text.secondary" textAlign="center" variant="body2">
                  {copy.footerPrompt}{" "}
                  <Link component={RouterLink} to={copy.footerLinkTo} underline="hover">
                    {copy.footerLinkLabel}
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        aria-labelledby="auth-error-title"
        fullWidth
        maxWidth="xs"
        open={Boolean(serverError)}
        onClose={() => setServerError("")}
      >
        <DialogTitle id="auth-error-title">{copy.errorTitle}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" variant="body2">
            {serverError}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button type="button" variant="contained" onClick={() => setServerError("")}>
            Try again
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AuthForm;
