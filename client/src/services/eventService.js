import API from "./apiService";

export const getUniqueEventYears = async() => {
    return API.get("/event/unique-years")
}

export const getEventsByYear = async(year) => {
    return API.get(`/event/${year}`)
}