// users-service.js
import axios from "axios";

const API_BASE_URL = "/api/users";
const API_BASE_URL_2 = "/users";

const UsersService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/get`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Eylemleri getirirken hata:", error);
      throw error;
    }
  },

  getUsersById: async (id) => {
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

  getUserInfo: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserInfo`, {
        headers: { Authorization: "Bearer "+ token },
      });
      return response.data;
    } catch (error) {
      console.error("Error while fetching user info:", error);
      throw error;
    }
  },

  saveUser: async (user) => {
    try {
      const response = await axios.post(`${API_BASE_URL_2}/create`, user);
      return response.data;
    } catch (error) {
      console.error("Eylemi kaydederken hata:", error);
      throw error;
    }
  },

  updateUser: async (id, user) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`ID'si ${id} olan eylemi güncellerken hata:`, error);
      throw error;
    }
  },

  resetPassword: async (eposta, newPassword) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL_2}/resetPassword/${eposta}`,
        null,
        {
          params: { newPassword: newPassword },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `E-posta adresi "${eposta}" olan kullanıcının şifresini sıfırlarken hata:`,
        error
      );
      throw error;
    }
  },

  forgotResetPassword: async (eposta, newPassword, securityCode) => {
  try {
    const response = await axios.put(
        `${API_BASE_URL_2}/forgot/resetPassword/${eposta}`,
      null,
      {
        params: { newPassword: newPassword, securityCode: securityCode },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `E-posta adresi "${eposta}" olan kullanıcının şifresini güvenlik kodu ile sıfırlarken hata:`,
      error
    );
    throw error;
  }
},

  resetEmail: async (id, newEmail) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/resetEmail/${id}`, null, {
        params: { newEmail: newEmail },
      });
      return response.data;
    } catch (error) {
      console.error(`ID'si ${id} olan kullanıcının eposta adresini sıfırlarken hata:`, error);
      throw error;
    }
  },
  

  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error(`ID'si ${id} olan eylemi silerken hata:`, error);
      throw error;
    }
  },

  checkEmail: async (email) => {
    try {
      const users = await UsersService.getAllUsers();
      const existingUser = users.find((user) => user.eposta === email);
      return !!existingUser;
    } catch (error) {
      console.error("E-posta adresini kontrol ederken hata:", error);
      throw error;
    }
  },
};

export default UsersService;
