import { useAuth } from "../features/auth/AuthProvider";
import AuthForm from "../features/auth/components/AuthForm";

function LoginPage() {
  const { login } = useAuth();

  return <AuthForm mode="login" onSubmit={login} />;
}

export default LoginPage;
