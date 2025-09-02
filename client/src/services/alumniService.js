import API from "./apiService"

export const getAlumniDetails = async (params) => {
    return API.get('/alumni/', { params });
};

export const getAllCompaniesAndExpertise = async () => {
    return API.get('/alumni/get-companies-and-expertise');
};