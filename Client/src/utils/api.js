import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 MUST
});

export default api;