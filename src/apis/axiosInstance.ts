import axios from "axios";

const api = axios.create({
  baseURL: "https://modubot.shop",
});

export default api;
