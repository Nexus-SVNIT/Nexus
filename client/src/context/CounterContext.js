import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_BASE_URL + '/counter');
            setCount(response.data);
        } catch (error) {
            console.error('Error fetching count:', error);
        }
    };

    const incrementCount = async () => {
        if (process.env.REACT_APP_ENV !== 'prod') {
            try {
                const response = await axios.post(process.env.REACT_APP_BACKEND_BASE_URL + '/counter/increment');
                setCount(response.data);
            } catch (error) {
                console.error('Error incrementing count:', error);
            }
        } else {
            fetchCount();
        }
    };

    useEffect(() => {
        incrementCount();
    }, []);

    return (
        <CounterContext.Provider value={{ count, incrementCount, fetchCount }}>
            {children}
        </CounterContext.Provider>
    );
};

export default CounterContext;