import {
  Children,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getStoredContext, setStoredContext } from "./utils";
import { getProfile, postLogin, Profile } from "./api";
import { API } from "../utils";

export interface User {
  name?: string;
  email?: string;
  isAuthenticated: boolean;
  authentication_token?: string;
}

export interface AuthContextInterface {
  user: User | null;
  login: (username: string, password: string) => Promise<API<Profile>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(getStoredContext());

  useEffect(() => {
    if (user)
      getProfile(user)
        .then((data) => {
          if (data.body) setUser({ ...data.body, isAuthenticated: true });
        })
        .catch(() => {
          setUser({
            name: "",
            email: "",
            authentication_token: "",
            isAuthenticated: false,
          });
        });
  }, []);

  const login = async (username: string, password: string) => {
    const data = await postLogin(username, password);
    if (data.body) {
      setStoredContext({ ...data.body, isAuthenticated: true });
      setUser({ ...data.body, isAuthenticated: true });
    } else {
      setStoredContext({
        name: "",
        email: "",
        authentication_token: "",
        isAuthenticated: false,
      });
      setUser({
        name: "",
        email: "",
        authentication_token: "",
        isAuthenticated: false,
      });
    }
    return data;
  };

  const logout = async () => {};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
