import { api } from "./client";

export const getBookings = async (params = {}) => {
  const { data } = await api.get("/bookings/", { params });
  return data;
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}/`);
  return data;
};

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings/", payload);
  return data;
};

export const updateBookingStatus = async (id, payload) => {
  const { data } = await api.patch(`/bookings/${id}/status/`, payload);
  return data;
};