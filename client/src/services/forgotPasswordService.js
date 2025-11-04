import API from "./apiService";

export const sendforgotPasswordEmail = async(admissionNumber) => {
    return API.post("/auth/forgot-password", { admissionNumber });
}