import { authOptions } from "@/utils/AuthOptions";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const AuthContext = React.createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  //   useEffect(() => {
  //     const getUserProfile = async () => {
  //       console.log("chamado");
  //       const session = await getSession(context)
  //       console.log(session);
  //       if (session) {
  //         setUser(session);
  //       }
  //     };
  //     getUserProfile();
  //   }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;
