import API from "./apiService";

export const createForm = async (formObject) => {
    return API.post(`/forms/create`, formObject, {
            headers: {
                "Content-Type": "application/json",
            }
    })
}

export const updateForm = async (formId, formObject) => {
    return API.post(`/forms/update/${formId}`, formObject, {
            headers: {
                "Content-Type": "application/json",
            }
    })
}

export const getForm = async (formId) => {
    return API.get(`/forms/${formId}`);
}