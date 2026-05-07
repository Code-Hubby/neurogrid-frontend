import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const solvePath = async (grid, start, end, algo) => {
  const res = await axios.post(`${BASE_URL}/solve`, {
    grid,
    start,
    end,
    algo,
  });

  return res.data;
};