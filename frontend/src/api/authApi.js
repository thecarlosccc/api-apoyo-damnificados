import api from "./axiosClient";

export async function login(login, contrasena) {
  const { data } = await api.post("/api/auth/login", { login, contrasena });
  if (data?.token) localStorage.setItem("TOKEN", data.token);
  if (data?.user) localStorage.setItem("USER", JSON.stringify(data.user));
  return data;
}

export async function registerDonante(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  if (data?.token) localStorage.setItem("TOKEN", data.token);
  if (data?.user) localStorage.setItem("USER", JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("USER");
}

export function getUser() {
  const raw = localStorage.getItem("USER");
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem("TOKEN");
}
