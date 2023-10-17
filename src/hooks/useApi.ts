import api from "@/utils/api";

export const useApi = () => ({
  getUploadedAnimes: async () => {
    try {
      const response = await api.get("/anime");
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
});
