import { useAuth } from "../features/auth/model/useAuth";
import AuthForm from "../features/auth/components/AuthForm";

function SignupPage() {
  const { register } = useAuth();

  return <AuthForm mode="signup" onSubmit={register} />;
}

export default SignupPage;
