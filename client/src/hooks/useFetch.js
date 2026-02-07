import { useEffect, useState } from "react";
import API from "../services/apiService";

const useFetch = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
       
        const data = await API.get(path);
        setData(data);

      } catch (err) {
        const status = err.response?.status;

       
        if (status === 401) return;

    
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (path) fetchData();
  }, [path]);

  return { data, loading, error };
};

export default useFetch;
