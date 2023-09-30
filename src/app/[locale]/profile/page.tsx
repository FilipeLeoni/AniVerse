"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next-intl/server";
import { useSession } from "next-auth/react";

import api from "@/utils/api";
import Cookies from "js-cookie";

export default function Profile() {
  const [example, setExample] = useState<any>();
  const { data } = useSession();

  const session: any = data;
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          "/user/f5abec2a-446f-483f-9a43-52adb00cd3cc",
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const responseData = response.data;
        setExample(responseData);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    }

    fetchData();
  }, [accessToken]);

  if (session === null) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen w-full flex-col justify-center items-center">
      <p>{session?.user?.name}</p>
      <div>{example?.email}</div>
      <div>Items</div>
    </div>
  );
}
