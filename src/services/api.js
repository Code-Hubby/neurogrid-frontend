/**
 * NeuroGrid - API Service
 * Handles all communication with the FastAPI backend.
 */
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Solve the grid using the specified AI algorithm.
 *
 * @param {number[][]} grid      - 2D array (0=open, 1=wall)
 * @param {[number,number]} start - [row, col] start position
 * @param {[number,number]} end   - [row, col] end position
 * @param {string} algo           - "bfs" | "dfs" | "astar"
 * @returns {Promise<{path: number[][], length: number, found: boolean}>}
 */
export async function solveGrid(grid, start, end, algo) {
  const response = await api.post("/solve", { grid, start, end, algo });
  return response.data;
}

/**
 * Check backend health.
 * @returns {Promise<{status: string, algorithms: string[]}>}
 */
export async function checkHealth() {
  const response = await api.get("/health");
  return response.data;
}

export default api;
