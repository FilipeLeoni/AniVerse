import { useUser } from "@/contexts/AuthContext";
import { Room } from "@/@types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CreateRoomBody {
  mediaId: number;
  episodeId: string;
  title?: string;
  visibility: "public" | "private";
}

const useCreateRoom: any = () => {
  const user = useUser();
  const router = useRouter();
  return useMutation({
    mutationKey: ["createRoom"],
    mutationFn: async (room: CreateRoomBody) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wwf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      return data;
    },
    onSuccess(room: any) {
      router.replace(`/wwf/${room.id}`);
    },
    onError(error: any) {
      toast.error(error.message);
    },
  });
};

export default useCreateRoom;
