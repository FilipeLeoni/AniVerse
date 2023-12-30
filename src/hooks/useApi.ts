import { Api } from "@/utils/api";
import Cookies from "js-cookie";
import { UseBrowseOptions } from "./useBrowseAnime";

const accessToken = Cookies.get("accessToken");

export const useApi = () => ({
  getUploadedAnimes: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await Api.get(
        `/anime?page=${page}&pageSize=${pageSize}`
      );
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

  getAnimeById: async (id: number | string) => {
    try {
      const response = await Api.get(`/anime/${id}`);
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
});
