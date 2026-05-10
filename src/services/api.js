import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const solvePath = async (data) => {
  const response = await API.post("/solve", data);
  return response.data;
};