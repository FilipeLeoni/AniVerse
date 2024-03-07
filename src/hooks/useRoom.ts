import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

export const useRoom = (roomId: number) => {
  const api = useApi();
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const res = await api.getRoomById(roomId);
      console.log(res);
      return res;
    },
  });
};
