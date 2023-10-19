import api from "@/utils/api";

export const useApi = () => ({
  getUploadedAnimes: async (page: number = 1, pageSize: number = 10) => {
    console.log(page);
    try {
      const response = await api.get(
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
      const response = await api.get("/manga");
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getAnimeById: async (id: string) => {
    try {
      const response = await api.get(`/anime/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  search: async (query: string, type: string) => {
    try {
      const response = await api.get(`/anime/search?query=${query}`);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
});
