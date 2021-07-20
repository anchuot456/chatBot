import axios from "axios";

export const axiosGuestInstance = axios.create({
  baseURL: "https://salty-fortress-49217.herokuapp.com/v1/",
  timeout: 5000000,
});
