import { Api } from "@/utils/api";
import Cookies from "js-cookie";
import { UseBrowseOptions } from "./useBrowseAnime";
import { getStartAndEndOfDay } from "@/utils";
import toast from "react-hot-toast";

const accessToken = Cookies.get("accessToken");

export const useApi = () => ({
  getUploadedAnimes: async (page: number = 1, pageSize: number = 50) => {
    try {
      const response = await Api.get(
        `/anime?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getRecentlyUpdated: async () => {
    try {
      const response = await Api.get(`anime/dashboard/recently-updated`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getRecentlyUpdatedManga: async () => {
    try {
      const response = await Api.get(`manga/dashboard/recently-updated`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getPopularAnime: async () => {
    try {
      const response = await Api.get(`anime/dashboard/popular`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getPopularManga: async () => {
    try {
      const response = await Api.get(`manga/dashboard/popular`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getRecommed: async () => {
    try {
      const response = await Api.get(`anime/dashboard/recommend`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getRecommedManga: async () => {
    try {
      const response = await Api.get(`manga/dashboard/recommend`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getUploadedManga: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await Api.get("/manga");
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getTrendingAnime: async () => {
    try {
      const response = await Api.get("/anime/dashboard/trending");
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getTrendingManga: async () => {
    try {
      const response = await Api.get("/manga/dashboard/trending");
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getAnimeById: async (id: number | string, episode: boolean = false) => {
    try {
      const response = await Api.get(`/anime/${id}?episode=${episode}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getMangaById: async (id: number | string) => {
    try {
      const response = await Api.get(`/manga/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getAnimeByMediaIds: async (ids: any) => {
    try {
      const response = await Api.get("/anime/media/get", {
        params: {
          media_ids: ids.join(","),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await Api.get(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getUserByName: async (userName: string) => {
    try {
      const response = await Api.get(`user/username/${userName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getUserRoleHigh: async (role: string) => {
    try {
      const response = await Api.get(`user/roles/${role}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  PutUserRoles: async (userId: string, role: string) => {
    try {
      const response = await Api.put(`user/role/update/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        role,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getAnimeSchedule: async (animeId: string) => {
    try {
      const response = await Api.get(`schedule/anime/${animeId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getMangaSchedule: async (mangaId: string) => {
    try {
      const response = await Api.get(`schedule/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  PutScheduleAnime: async (
    animeId: string,
    { schedule, episode }: { schedule: any; episode: string }
  ) => {
    try {
      console.log({
        schedule,
        episode,
      });
      // const response = await Api.put(`anime/schedule/${animeId}`, {
      //   // headers: {
      //   //   Authorization: `Bearer ${accessToken}`,
      //   // },
      //   schedule: "2024-02-19T03:00:00.000Z",
      //   episode: 12,
      // });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/anime/schedule/${animeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ schedule, episode }),
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  postAnimeSchedule: async (animeId: string, data: any) => {
    try {
      const response = await Api.post(`anime/schedule/${animeId}`, data);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  postAnimeEpisode: async (data: any) => {
    try {
      const response = await Api.post(`episodes/create`, data);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  deleteAnimeEpisode: async (episodeId: any) => {
    try {
      const response = await Api.delete(`episodes/${episodeId}`);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  putUserBanned: async (uuid: string, status: boolean) => {
    try {
      const response = await Api.put(`user/banStatus/${uuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        isBanned: status,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  search: async (options: UseBrowseOptions) => {
    try {
      const response = await Api.get(`/anime/search?query=`);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getList: async (
    userId: string,
    page: number,
    perPage: number,
    status: string = "",
    type: string = "ANIME"
  ) => {
    type === "ANIME" ? (type = "watchlist") : (type = "readinglist");
    try {
      const response = await Api.get(
        `/list/${userId}/${type}?page=${page}&perPage=${perPage}&status=${status}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getStatusById: async (
    userId: string,
    mediaId: number,
    type: string = "ANIME"
  ) => {
    type === "ANIME" ? (type = "watchlist") : (type = "readinglist");

    try {
      const response = await Api.get(`/list/${userId}/${type}/${mediaId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getEpisodeById: async (id: string) => {
    try {
      const response = await Api.get(`/episodes/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getEpisodeByAnime: async (animeId: number) => {
    try {
      const response = await Api.get(`/episodes/anime/${animeId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  // Chapters

  getChapterById: async (id: string) => {
    try {
      const response = await Api.get(`chapter/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getMangaChapterById: async (id: string) => {
    try {
      const response = await Api.get(`manga/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getMangaMediaByIds: async (ids: string[]) => {
    try {
      const response = await Api.get("/manga/media/get", {
        params: {
          media_ids: ids.join(","),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getSearchResults: async (options: UseBrowseOptions) => {
    console.log(options);
    try {
      const queryParams = Object.entries(options)
        .filter(
          ([key, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value?.length !== 0
        )
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `anime/search?${queryParams}`;

      console.log(url);
      const response = await Api.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  getMangaSearch: async (options: UseBrowseOptions) => {
    console.log(options);
    try {
      const queryParams = Object.entries(options)
        .filter(
          ([key, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value?.length !== 0
        )
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `manga/search?${queryParams}`;

      console.log(url);
      const response = await Api.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getCharacterSearch: async (options: UseBrowseOptions) => {
    console.log(options);
    try {
      const queryParams = Object.entries(options)
        .filter(
          ([key, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value?.length !== 0
        )
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `character/search/query?${queryParams}`;

      console.log(url);
      const response = await Api.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getCharacterById: async (characterId: string) => {
    try {
      const response = await Api.get(`character/${characterId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getRoomById: async (roomId: number) => {
    try {
      const response = await Api.get(`wwf/${roomId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  UploadImage: async (file: any) => {
    try {
      const response = await Api.post(`upload/file`, file);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  UploadVideo: async (file: any) => {
    try {
      const toastId = toast.loading("Uploading video...");
      const response = await Api.post(`upload/video`, file, {
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          toast.loading(`Uploading video... ${percentCompleted}%`, {
            id: toastId,
          });

          if (percentCompleted === 100) {
            toast.success("Video uploaded successfully", {
              id: toastId,
            });
          }
          console.log(percentCompleted);
          // setUploadProgress(percentCompleted);
          // setUploadStatus(`Enviando... ${percentCompleted}%`);
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  UpdateUserBanner: async (userId: string, banner: any) => {
    try {
      const response = await Api.put(`user/${userId}/banner`, banner);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  createChapter: async ({
    mangaId,
    chapterNumber,
    chapterName,
    images,
  }: any) => {
    try {
      const response = await Api.post(`/chapter/${mangaId}/create`, {
        number: chapterNumber,
        title: chapterName,
        pages: images,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getNotifications: async (userId: string) => {
    try {
      const response = await Api.get(`notification/${userId}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  seenNotifications: async (userId: string, notifications: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/${userId}/seen`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notifications }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  // Episodes

  // getEpisodeById: async (episodeId: string) => {
  //   try {
  //     const response = await Api.get(`/episodes/${episodeId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  getActiveRooms: async () => {
    try {
      const response = await Api.get("wwf");
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getRecommendations: async (animeId: string, quantity: number = 14) => {
    try {
      const response = await Api.get(
        `anime/recommendation/${animeId}?quantity=${quantity}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  getScheduleTimeLineByDay: async (timestamp: number) => {
    try {
      const unixDay = getStartAndEndOfDay(timestamp);
      console.log(unixDay);
      const response = await Api.get(
        `schedule/day?greater=${unixDay.airingAt_greater}&lesser=${unixDay.airingAt_lesser}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteAnimeSchedule: async (id: string) => {
    try {
      const response = await Api.delete(`schedule/${id}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
});
