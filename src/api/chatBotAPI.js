import axios from "axios";

export const axiosGuestInstance = axios.create({
  baseURL: "http://localhost:3030/v1/",
  timeout: 5000000,
});
