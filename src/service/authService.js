import axios from "axios";

const apiUrl = "/authenticate";

export const loginUser = async (eposta, password) => {
  try {
    const response = await axios.post(apiUrl + "/login", {
      eposta: eposta,
      password: password,
    });
    const token = response.data.token;

    if (token) {
      const userRoles = JSON.parse(atob(token.split(".")[1])).roles;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("role",userRoles[0].authority);
    }

    return response.data;
  } catch (error) {
    // İstek başarısızsa burada hata işlemlerini yapabilirsiniz
    console.error("Error during login:", error);
    throw error;
  }
};
