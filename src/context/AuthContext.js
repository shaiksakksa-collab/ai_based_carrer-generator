import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_current_user")); } catch { return null; }
  });

  const login = (u) => { setUser(u); localStorage.setItem("sp_current_user", JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem("sp_current_user"); };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
