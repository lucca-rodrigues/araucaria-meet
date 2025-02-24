import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";

interface SignInFormData {
  email: string;
  password: string;
}

export function useSignIn() {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  });

  return {
    register,
    onSubmit,
    errors,
  };
}
