import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

// Usamos proxy de Vite (recomendado): baseURL vacío y rutas /api/...
// Si prefieres URL directa, comenta la línea de abajo y descomenta la siguiente.
const api = axios.create({ baseURL: "" });
// const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
