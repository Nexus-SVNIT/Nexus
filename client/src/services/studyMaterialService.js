import API from "./apiService";


export const getSubjects = async (params) => {
  return API.get("/resources/subjects", { params });
};


export const getSubjectDetails = async (id) => {
  return API.get(`/resources/subjects/${id}`);
};


export const getResourcesBySubject = async (id, options = {}) => {
  try {
    const params = {};

    // Add only defined params to avoid sending empty strings
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.subCategory) params.subCategory = options.subCategory;
    if (options.type) params.type = options.type;
    if (options.search) params.search = options.search;

    const response = await API.get(`/resources/subjects/${id}/resources`, { params });

    if (response.data.success) {
      return response.data;
    } else {
      console.error("API Error:", response.data.message || "Unknown error");
      return { success: false, message: response.data.message || "Failed to fetch resources" };
    }
  } catch (error) {
    console.error("Network or API Error:", error.message);
    return { success: false, message: error.message || "Network error" };
  }
};
