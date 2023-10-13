"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  user: any | null;
  id: any;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  id: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [id, setId] = useState<any | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextData => {
  return useContext(AuthContext);
};
