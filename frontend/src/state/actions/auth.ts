import { loginUser, registerUser } from "../../api/auth";
import type { StateSetters, StateValues } from "./../types";
import type { User } from "../../lib/types";

export function createAuthActions(_: StateValues, setters: StateSetters) {
  const { setCurrentUser, setCurrentUserId } = setters;

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await loginUser(email, password);
    if (!result) return false;

    setCurrentUser(result.user);
    setCurrentUserId(result.user.id);
    localStorage.setItem("vita-current-user", JSON.stringify(result.user));
    return true;
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    const result = await registerUser(data);
    if (!result) return false;

    setCurrentUser(result.user);
    setCurrentUserId(result.user.id);
    localStorage.setItem("vita-current-user", JSON.stringify(result.user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserId(null);
    localStorage.removeItem("vita-current-user");
    localStorage.removeItem("vita-auth-token");
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("vita-current-user", JSON.stringify(user));
  }

  return { login, signup, logout, updateUser };
}
