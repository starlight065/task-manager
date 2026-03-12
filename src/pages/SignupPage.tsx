import { useAuth } from "../features/auth/AuthProvider";
import AuthForm from "../features/auth/components/AuthForm";

function SignupPage() {
  const { register } = useAuth();

  return <AuthForm mode="signup" onSubmit={register} />;
}

export default SignupPage;
