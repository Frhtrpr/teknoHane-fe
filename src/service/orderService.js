//orders-Service

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/orders";

const OrdersService = {
  getAllOrders: async () => {
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

  getOrderById: async (id) => {
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

  getOrdersByUserId: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getOrdersByUserId`, {
        headers: { Authorization: "Bearer " +token },
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getiriken hata: ", error);
      throw error;
    }
  },

 saveOrders: async (productIds) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.post(`${API_BASE_URL}/create`, productIds, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    console.error("Eylemi kaydederken hata: ", error);
    throw error;
  }
},


  updateOrder: async (id, order) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${id}`,
        order
      );
      return response.data;
    } catch (error) {
      console.error("${id}'si id'si olan eylemleri getiriken hata: ", error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, id);
      return response.data;
    } catch (error) {
      console.error("${id}'si olan eylemi silerken hata:", error);
      throw error;
    }
  },
};

export default OrdersService;
