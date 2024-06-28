//cartService-Service

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/carts";

const CartsService = {
  getAllCarts: async () => {
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

  getCartById: async (id) => {
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

  getCartsByUserId: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCartByUserId`, {
        headers: { Authorization: "Bearer " + token },
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getiriken hata: ", error);
      throw error;
    }
  },

  savetoCart: async (cart) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, cart);
      return response.data;
    } catch (error) {
      console.error("Eylemi kaydederken hata: ", error);
      throw error;
    }
  },

  updatetoCard: async (id, cart) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${id}`, cart);
      return response.data;
    } catch (error) {
      console.error("${id}'si id'si olan eylemleri getiriken hata: ", error);
      throw error;
    }
  },

  deleteCard: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, id);
      return response.data;
    } catch (error) {
      console.error("${id}'si olan eylemi silerken hata:", error);
      throw error;
    }
  },
  updatetoCard: async (id, newQuantity) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${id}`,
        { quantity: newQuantity }, // Update the quantity here
        { headers: { "Content-Type": "application/json" } } // Set the correct Content-Type header
      );
      return response.data;
    } catch (error) {
      console.error("${id}'si id'si olan eylemleri getiriken hata: ", error);
      throw error;
    }
  },

  deleteByProductId: async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteByProductId/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("${productId}' si olan eylemi silerken hata: ", error);
      throw error;
    }
  },
};

export default CartsService;
