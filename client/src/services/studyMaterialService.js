import API from "./apiService";

export const fetchSubjectDetails = async (id) => {
  try {
    const response = await API.get(`/study-material/subjects/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("API error:", response.data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Network or server error:", error);
    return null;
  }
};

export const fetchSubjects = async (category, department) => {
  try {
    const response = await API.get("/study-material/subjects", {
      params: { category, department },
    });

 
    if (response.data.success) {
      
      return response.data.data;
    } else {
      console.error("API error:", response.data.message || "Unknown error");
      return [];
    }
  } catch (error) {
    console.error("Network or server error:", error);
    return [];
  }
};
