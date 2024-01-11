import { useEffect, useState } from "react";

const useFetch = (path, deps = []) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = () => {
        setLoading(true);

        try {
            fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${path}`)
                .then((res) => res.json())
                .then((res) => setData(res));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchData();
    }, deps);
    return { data, loading, error };
};

export default useFetch;
