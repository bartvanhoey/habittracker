import { createContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "../lib/appwrite";

export type AuthContextType = {
  user: Models.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authChecked: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  async function login(email: string, password: string) {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password,
      );
      console.log("Login successful:", response);

      const userData = await account.get();
      console.log("User data retrieved:", userData);
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);

      throw err instanceof Error ? err : new Error("Login failed");
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await account.create(ID.unique(), email, password);

      console.log("Registration successful:", response);

      // Automatically log the user in after registration
      await login(email, password);
    } catch (err) {
      console.error("Registration failed:", err);

      throw err instanceof Error ? err : new Error("Registration failed");
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (err) {
      // throw err instanceof Error
      //   ? err
      //   : new Error("Logout failed");
      console.error("Logout failed:", err);
    }
  }

  async function getInitialUser() {
    try {
      const userData = await account.get();
      console.log("Initial user data retrieved:", userData);
      setUser(userData);
    } catch (err) {
      // console.error("Failed to retrieve initial user data:", err);
      setUser(null);
    } finally {
      console.log("Finished attempting to retrieve initial user data");
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, authChecked }}
    >
      {children}
    </AuthContext.Provider>
  );
}
