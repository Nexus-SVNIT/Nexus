import { useEffect, useState } from "react";

const useFetch = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchData();
  }, [path, loading]);
  return { data, loading, error };
};

export default useFetch;
