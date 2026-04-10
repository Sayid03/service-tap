import { api } from "./client";

export const getServices = async (params = {}) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  const { data } = await api.get("/services/", { params: cleanedParams });
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

export const createService = async (payload) => {
  const { data } = await api.post("/services/", payload);
  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await api.patch(`/services/${id}/`, payload);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}/`);
  return data;
};