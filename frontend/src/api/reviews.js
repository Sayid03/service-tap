import { api } from "./client";

export const getReviews = async (params = {}) => {
  const { data } = await api.get("/reviews/", { params });
  return data;
};

export const createReview = async (payload) => {
  const { data } = await api.post("/reviews/", payload);
  return data;
};