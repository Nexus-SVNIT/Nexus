import API from "./apiService"

export const getAlumniDetails = async (params) => {
    return API.get('/alumni/', { params });
};

export const getAllCompaniesAndExpertise = async () => {
    return API.get('/alumni/get-companies-and-expertise');
};

export const addAlumniDetails = async (alumniData) => {
    return API.post('/alumni/add', alumniData);
};

export const postAlumni = async (alumniId, alumniData) => {
    return API.post(`/auth/alumni/signup/`, alumniData, {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
};

export const getAllAlumni = async() => {
    return API.get('/alumni');
}