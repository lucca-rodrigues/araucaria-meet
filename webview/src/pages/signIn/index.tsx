import { useSignIn } from "./hooks/useSignIn";
import { SignInTemplate } from "./template";

export function SignIn() {
  const hookParams = useSignIn();

  const sharedProps = {
    ...hookParams,
  };

  return <SignInTemplate {...sharedProps} />;
}
