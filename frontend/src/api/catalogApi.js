import api from "./axiosClient";

// Catálogo público de "productos" (en este proyecto, son donaciones disponibles)
export async function listarProductos() {
  const { data } = await api.get("/api/productos");
  return Array.isArray(data) ? data : [];
}

// Catálogo público de puntos de interés (centros / albergues / puntos de entrega)
export async function listarPuntosInteres() {
  const { data } = await api.get("/api/puntos-interes");
  return Array.isArray(data) ? data : [];
}
