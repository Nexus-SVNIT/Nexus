import axios from "axios";

const incrementCount = async () => {
    try {
        if(process.env.REACT_APP_ENV !== 'prod')
            await axios.post(process.env.REACT_APP_BACKEND_BASE_URL + '/counter/increment');
    } catch (error) {
        console.error('Error incrementing count:', error);
    }
};

export default incrementCount;