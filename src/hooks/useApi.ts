import { Api } from "@/utils/api";
import Cookies from "js-cookie";

const accessToken = Cookies.get("accessToken");

export const useApi = () => ({
  getUploadedAnimes: async (page: number = 1, pageSize: number = 10) => {
    console.log(page);
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

  getAnimeById: async (id: number) => {
    try {
      const response = await Api.get(`/anime/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
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

  search: async (query: string, type: string) => {
    try {
      const response = await Api.get(`/anime/search?query=${query}`);
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

  getEpisodeById: async (id: number) => {
    try {
      const response = await Api.get(`/episodes/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
});
