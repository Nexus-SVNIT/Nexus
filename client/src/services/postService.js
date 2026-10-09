import API from "./apiService";

export const getAllPosts = async (params = {}) => {
  return API.get("/posts/", { params });
};

export const getPostById = async (id) => {
  return API.get(`/posts/${id}`);
};
