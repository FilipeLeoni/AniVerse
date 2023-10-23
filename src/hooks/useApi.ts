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
      console.log(response);
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
});
