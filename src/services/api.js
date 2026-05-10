import axios from "axios";

export const solvePath = async (grid, start, end, algo) => {
  const res = await axios.post("http://127.0.0.1:8000/solve", {
    grid,
    start,
    end,
    algo,
  });

  return res.data;
};