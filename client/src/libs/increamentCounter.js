import axios from "axios";

const incrementCount = async () => {
    try {
        const response = await axios.post(process.env.REACT_APP_BACKEND_BASE_URL + '/api/counter/increment');
    } catch (error) {
        console.error('Error incrementing count:', error);
    }
};

export default incrementCount;