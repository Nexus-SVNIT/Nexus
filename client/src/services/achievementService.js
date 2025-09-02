import API from "./apiService"

export const getAchivements = async() => {
    return API.get('/achievements/');
}
