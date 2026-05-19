import api from "./api";

export const loginRequest = (payload) => api.post("/auth/login", payload);
export const signupRequest = (payload) => api.post("/auth/signup", payload);
export const getMe = () => api.get("/auth/me");
