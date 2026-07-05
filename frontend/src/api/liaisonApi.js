import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function postSimulation(params) {
  const response = await client.post("/simulate/", params);
  return response.data;
}

export async function getSimulations(page = 1) {
  const response = await client.get(`/simulations/?page=${page}`);
  return response.data;
}

export async function getSimulationDetail(id) {
  const response = await client.get(`/simulations/${id}/`);
  return response.data;
}
