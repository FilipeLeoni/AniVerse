import { useUser } from "@/contexts/AuthContext";
import { Room } from "@/@types";
import { useMutation } from "@tanstack/react-query";

interface CreateRoomBody {
  mediaId: number;
  episodeId: string;
  title?: string;
  visibility: "public" | "private";
}

const useCreateRoom: any = () => {
  const user = useUser();
  // const router = useRouter();

  return useMutation({});

  // return useMutation<Room, any, CreateRoomBody, any>(
  //   async (body) => {
  //     const { data, error } = await supabaseClient
  //       .from<Room>("kaguya_rooms")
  //       .insert({
  //         hostUserId: user.id,
  //         mediaId: body.mediaId,
  //         episodeId: body.episodeId,
  //         visibility: body.visibility,
  //         title: body.title || null,
  //       })
  //       .single();

  //     if (error) throw error;

  //     return data;
  //   },
  //   {
  //     onSuccess: (room) => {
  //       router.replace(`/wwf/${room.id}`);
  //     },
  //     onError: (error) => {
  //       toast.error(error);
  //     },
  //   }
  // );
};

export default useCreateRoom;
