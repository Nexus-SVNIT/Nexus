import API from "./apiService";

export const getCounter = async() => {
    return API.get("/counter")
}

export const incrementCounter = async() => {
    return API.post("/counter/increment")
}