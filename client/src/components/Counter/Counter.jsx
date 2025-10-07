import { useContext, useEffect } from 'react';
import CountUp from 'react-countup';
import { CounterContext } from '../../context/CounterContext';

const Counter = ({ onComplete }) => {
  const { count } = useContext(CounterContext);

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