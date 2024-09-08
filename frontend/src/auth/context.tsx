import {
  Children,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getStoredContext } from "./utils";

export interface User {
  name?: string;
  email?: string;
  isAuthenticated: boolean;
  token?: string;
}

export interface AuthContextInterface {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  (() => {
    const localUser = getStoredContext();
    console.log(localUser);
  })();

  useEffect(() => {}, [user]);

  const login = async () => {};

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
