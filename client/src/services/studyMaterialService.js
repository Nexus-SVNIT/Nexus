import API from "./apiService";


export const getSubjects = async (params) => {
  return API.get("/resources/subjects", { params });
};


export const getSubjectDetails = async (id) => {
  return API.get(`/resources/subjects/${id}`);
};



