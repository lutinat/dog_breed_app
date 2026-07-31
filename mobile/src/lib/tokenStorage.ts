import { createStorage } from "./storage";

const tokenStore = createStorage("access_token");

export const getToken = tokenStore.get;
export const setToken = tokenStore.set;
export const clearToken = tokenStore.clear;
