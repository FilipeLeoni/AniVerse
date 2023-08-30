"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  user: any | null;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextData => {
  return useContext(AuthContext);
};
