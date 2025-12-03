import API from "./apiService";


export const getSubjects = async (params) => {
    
    return API.get('/study-material/subjects', { params });
};


 
export const getSubjectDetails = async (id) => {
    
    return API.get(`/study-material/subjects/${id}`);
};
