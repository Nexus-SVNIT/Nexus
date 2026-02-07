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
        const response = await API.get(path);
        
       
        if (response.success) {
            setData(response.data);
        } else {
            
            setError(response.message);
        }
      } catch (err) {
        
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (path) fetchData();
    
  }, [path]);

  return { data, loading, error };
};

export default useFetch;