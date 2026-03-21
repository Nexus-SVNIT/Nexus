import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import { getCounter, incrementCounter } from '../../services/counterService';

const Counter = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await getCounter();
      if(!response.success) {
        console.error('Error fetching count:', response.message);
        return;
      }
      setCount(response.data);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const incrementCount = async () => {
    try {
      const response = await incrementCounter();
      if(!response.success) {
        console.error('Error incrementing count:', response.message);
        return;
      }
      setCount(response.data);
    } catch (error) {
      console.error('Error incrementing count:', error);
    }
  };

  useEffect(() => {
    incrementCount();
    fetchCount();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="mb-2 text-lg font-medium tracking-wide text-zinc-400">VISITOR COUNT</h2>
      <div className="mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent drop-shadow-lg md:text-5xl">
        <CountUp
          end={count}
          duration={2.5}
          separator=","
          enableScrollSpy
          onEnd={onComplete}
        />
      </div>
    </div>
  );
};

export default Counter;