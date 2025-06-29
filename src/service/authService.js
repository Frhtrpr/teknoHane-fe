import axios from "axios";
import UsersService from "./usersService";

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
      const userInfo = await UsersService.getUserInfo(token);
      localStorage.setItem("firstName", userInfo?.firstName);
      localStorage.setItem("lastName", userInfo?.lastName);
      localStorage.setItem("role",userRoles[0].authority);
    }

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
