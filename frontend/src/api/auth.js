import { api } from "./client";

export const loginUser = async (payload) => {
  const { data } = await api.post("/users/login/", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/users/register/", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/users/me/");
  return data;
};