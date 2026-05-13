import useAsyncObject from "./useAsyncObject";
import { LOGIN_API } from "../utils/apiPath";

const useLogin = () => {
  const loginAsync = useAsyncObject();
  const handleLogin = (email: string, password: string) => {
    loginAsync.post(LOGIN_API, { email, password });
  };
  return { handleLogin, loginState: loginAsync.state };
};

export default useLogin;
