import api from "./axios";

export const loginApi = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};
