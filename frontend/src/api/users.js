import { api } from "./client";

export const getMe = async () => {
  const { data } = await api.get("/users/me/");
  return data;
};

export const getProviders = async (params = {}) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  const { data } = await api.get("/users/providers/", { params: cleanedParams });
  return data;
};

export const getProviderById = async (id) => {
  const { data } = await api.get(`/users/providers/${id}/`);
  return data;
};

export const updateProviderProfile = async (payload) => {
  const { data } = await api.put("/users/provider-profile/", payload);
  return data;
};