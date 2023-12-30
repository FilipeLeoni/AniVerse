import { useEffect } from "react";
import { useUser } from "@/contexts/AuthContext";
import { MediaType } from "@/@types/anilist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface MutationInput {
  media_id: number;
  episode_id: string;
  watched_time?: number;
  episode_number: number;
}

const useSaveWatched = () => {
  //   const user = useUser();
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const saveToBackend = async (data: MutationInput) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/save-watched-episode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar no backend");
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar no backend:", error);
      return false;
    }
  };

  const saveLocally = (data: any) => {
    try {
      const storedHistory = localStorage.getItem("aniverse_history");
      let watchedEpisodes = [];

      if (storedHistory) {
        watchedEpisodes = JSON.parse(storedHistory).watchedEpisodes || [];
      }

      const existingEpisodeIndex = watchedEpisodes.findIndex(
        (episode: any) => episode.episode_id === data.episode_id
      );

      if (existingEpisodeIndex !== -1) {
        watchedEpisodes[existingEpisodeIndex].watched_time = data.watched_time;
      } else {
        watchedEpisodes.push(data);
      }

      localStorage.setItem(
        "aniverse_history",
        JSON.stringify({ watchedEpisodes })
      );
      return true;
    } catch (error) {
      console.error("Erro ao salvar localmente:", error);
      return false;
    }
  };

  const saveWatchedMutation = useMutation({
    mutationKey: ["saveWatched"],
    mutationFn: async (data: any) => {
      if (user) {
        return await saveToBackend(data);
      } else {
        console.log(data);
        return saveLocally(data);

        // const storedHistory = localStorage.getItem("aniverse_history");

        // let watchedEpisodes = [];
        // if (storedHistory) {
        //   try {
        //     watchedEpisodes = JSON.parse(storedHistory).watchedEpisodes || [];
        //   } catch (error) {
        //     console.error("Erro ao parsear dados do localStorage:", error);
        //   }
        // }

        // const existingEpisodeIndex = watchedEpisodes.findIndex(
        //   (episode: any) => episode.episode_id === data.episode_id
        // );
        // // Adiciona o novo episódio à lista de episódios assistidos
        // // if (existingEpisodeIndex !== -1) {
        // //   console.log(watchedEpisodes);
        // //   console.log(watchedEpisodes[existingEpisodeIndex].watched_time);
        // //   // Se o episódio já existe na lista, atualiza o timestamp
        // //   console.log(data);
        // //   console.log("chamado aqui");
        // //   watchedEpisodes[existingEpisodeIndex].watched_time =
        // //     data.watched_time;
        // // } else {
        // console.log(data);

        // // Caso contrário, adiciona o episódio à lista
        // watchedEpisodes.push(data);
        // // }
        // // watchedEpisodes.push(data);

        // // Atualiza os dados no localStorage
        // localStorage.setItem(
        //   "aniverse_history",
        //   JSON.stringify({ watchedEpisodes })
        // );

        // return false;
      }
    },
  });

  console.log(saveWatchedMutation);

  return saveWatchedMutation;
};

export default useSaveWatched;
