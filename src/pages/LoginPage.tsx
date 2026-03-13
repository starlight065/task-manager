import { useAuth } from "../features/auth/model/useAuth";
import AuthForm from "../features/auth/components/AuthForm";

function LoginPage() {
  const { login } = useAuth();

  return <AuthForm mode="login" onSubmit={login} />;
}

export default LoginPage;
