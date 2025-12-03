import API from "./apiService";

export const getContributors = async() => {
    return API.get("/contributors/get")
}