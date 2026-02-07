import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
// Removed unused axios import
import { getCounter, incrementCounter } from '../../services/counterService';

const Counter = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await getCounter();
      
      // DEBUG: See what the backend actually sends
      console.log("FETCH COUNTER RESPONSE:", response);

      // CASE 1: Response IS the data (e.g. { count: 123 } or just 123)
      if (typeof response === 'number') {
          setCount(response);
          return;
      }
      if (response.count !== undefined) {
          setCount(response.count);
          return;
      }

      // CASE 2: Response is wrapped ({ success: true, data: 123 })
      if (response.data !== undefined) {
          setCount(response.data);
          return;
      }

      // CASE 3: It failed (explicit success: false)
      if (response.success === false) {
        console.error('Error fetching count:', response.message);
        return;
      }
      
      // Fallback: If we got an object but no specific fields, maybe the object IS the data?
      // But for counter, we need a number. Safer to do nothing or set 0.
      
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const incrementCount = async () => {
    try {
      const response = await incrementCounter();
      console.log("INCREMENT RESPONSE:", response);

      // Same robust checks as above
      if (typeof response === 'number') {
        setCount(response);
        return;
      }
      if (response.count !== undefined) {
        setCount(response.count);
        return;
      }
      if (response.data !== undefined) {
        setCount(response.data);
        return;
      }
      
      if (response.success === false) {
        console.error('Error incrementing count:', response.message);
      }

    } catch (error) {
      console.error('Error incrementing count:', error);
    }
  };

  useEffect(() => {
    // Increment first, then just use that result. 
    // No need to fetch immediately after if increment returns the new count.
    incrementCount(); 
    // You can keep fetchCount() if increment doesn't return the updated value
    // fetchCount(); 
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px] p-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[20px] p-8 md:p-12 
                      shadow-2xl text-center text-white transform transition-transform duration-300 
                      hover:-translate-y-2">
        <h2 className="text-2xl mb-4 text-gray-400 font-medium">Visitor Count</h2>
        <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 
                        bg-clip-text text-transparent">
          <CountUp
            end={count}
            duration={2.5}
            separator=","
            enableScrollSpy
            scrollSpyOnce
            onEnd={onComplete}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">Total Visits</p>
      </div>
    </div>
  );
};

export default Counter;