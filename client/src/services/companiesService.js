import API from "./apiService"

export const getCompanies = async () => {
    return API.get('/companies/');
}