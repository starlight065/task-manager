import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./AuthPages.css";

interface User {
  email: string;
  password: string;
}

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = password.length >= 14;
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isPasswordValid = hasMinLength && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isEmailValid || !isPasswordValid) {
      console.log("Signup failed: invalid email or password format");
      return;
    }

    try {
      const response = await fetch("/users.json");
      const users: User[] = await response.json();
      const exists = users.some((u) => u.email === email);

      if (exists) {
        console.log("Signup failed: email already registered");
      } else {
        console.log("Signup successful! Welcome,", email);
      }
    } catch {
      console.log("Signup failed: could not fetch users");
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
            className={`auth__input ${touched.email && !isEmailValid ? "auth__input--error" : ""}`}
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && !isEmailValid && (
            <span className="auth__error">Please enter a valid email</span>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            <button
              type="button"
              className="auth__eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="auth__rules">
            <span
              className={`auth__rule ${hasMinLength ? "auth__rule--valid" : ""}`}
            >
              At least 14 characters
            </span>
            <span
              className={`auth__rule ${hasSpecialChar ? "auth__rule--valid" : ""}`}
            >
              Minimum 1 special character
            </span>
          </div>
        </div>

        <button type="submit" className="auth__submit">
          Sign Up
        </button>

        <p className="auth__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth__link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
