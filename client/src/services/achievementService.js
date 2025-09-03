import API from "./apiService"

export const getAchivements = async() => {
    return API.get('/achievements/');
}

export const addAchievement = async (achievementData) => {
    return API.post('/achievements/add', achievementData);
}