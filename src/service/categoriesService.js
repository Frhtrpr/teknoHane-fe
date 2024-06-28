// categories-service.js
import axios from "axios";

const API_BASE_URL = "/categories";

const CategoriesService = {
  getAllCtegories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getirirken hata:", error);
      throw error;
    }
  },

  getCategoriesById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`ID'si ${id} olan eylemi getirirken hata:`, error);
      throw error;
    }
  },

  saveCategories: async (categories) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        categories
      );
      return response.data;
    } catch (error) {
      console.error("Eylemi kaydederken hata", error);
      throw error;
    }
  },

  updateCategories: async (id, categories) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${id}`,
        categories
      );
      return response.data;
    } catch (error) {
      console.error("Id si ${id} olan eylemi güncellerken hata", error);
      throw error;
    }
  },

  deleteCategories: async(id) => {
    try{
        const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
        return response.data;
    }
    catch(error){
        console.error("İd si ${id} olan eylemi silerken hata", error);
        throw error;
    }
  }
};

export default CategoriesService;
