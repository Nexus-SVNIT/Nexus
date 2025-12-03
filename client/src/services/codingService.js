import API from "./apiService"

export const getProfiles = async (params) => {
    return API.get(`/coding-profiles/get-profiles?${params.toString()}`);
};

export const getContests = async() => {
    return API.get('/coding-profiles/contests');
}