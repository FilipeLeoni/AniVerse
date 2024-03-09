import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useApi } from "./useApi";

const useNotifications = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const api = useApi();
  return useQuery<any>({
    queryKey: ["notifications", user],
    queryFn: async () => {
      const response = await api.getNotifications(user?.id as string);
      return response?.data;
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
};

export default useNotifications;
