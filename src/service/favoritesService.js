//favorites-Service

import axios from "axios";

const API_BASE_URL = "/api/favorites";

const FavoritesService = {
  getAllFavorites: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getirirken hata:", error);
      //throw error;
    }
  },

  getFavoritesById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("${id} si olan eylemleri getirirken hata: ", error);
      throw error;
    }
  },

  getFavoritesByUserId: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserFavoritesInfo`, {
        headers: { Authorization: "Bearer " + token },
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getiriken hata: ", error);
      throw error;
    }
  },

  saveFavorites: async (favorite) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, favorite);
      return response.data;
    } catch (error) {
      console.error("Eylemi kaydederken hata: ", error);
      throw error;
    }
  },

  updateFavorites: async (id, favorite) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${id}`,
        favorite
      );
      return response.data;
    } catch (error) {
      console.error("${id}'si id'si olan eylemleri getiriken hata: ", error);
      throw error;
    }
  },
  deleteFavorites: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("${id}'si olan eylemi silerken hata:", error);
      throw error;
    }
  },

  deleteByProductId: async (productId) => {
    try{
      const response = await axios.delete(`${API_BASE_URL}/deleteByProductId/${productId}`);
      return response.data;
    }catch(error){
      console.error("${productId}' si olan eylemi silerken hata", error);
      throw error;
    }
  }
};

export default FavoritesService;
