import { api } from "./client";

export const getServices = async (params = {}) => {
  const { data } = await api.get("/services/", { params });
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await api.get(`/services/${id}/`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/services/categories/");
  return data;
};