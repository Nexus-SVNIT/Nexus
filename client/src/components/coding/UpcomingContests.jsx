import axios from "axios";
import React, { useEffect, useState } from "react";

const UpcomingContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem('upcoming-contests'));
        if (
          localData &&
          localData.lastUpdated &&
          (new Date() - new Date(localData.lastUpdated)) < 86400000 &&
          Array.isArray(localData.data) &&
          localData.data.length > 0
        ) {
          setContests(localData.data);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/coding-profiles/contests`);
        const data = response.data;
        let contestsArray = [];
        if (data && data.success !== false && Array.isArray(data.data)) {
          contestsArray = data.data;
        }
        setContests(contestsArray);
        localStorage.setItem('upcoming-contests', JSON.stringify({ data: contestsArray, lastUpdated: new Date() }));
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-xl text-gray-500">Loading upcoming contests...</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-semibold text-blue-400 border-b border-blue-600 pb-2 mb-4">
        Upcoming Contests
      </h2>
      {Array.isArray(contests) && contests.length === 0 ? (
        <p className="text-gray-300">No upcoming contests available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(contests) && contests.map((contest, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-4 transition duration-200 hover:shadow-xl"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-1">
                <a href={contest.url} target="_blank" rel="noopener noreferrer">
                  {contest.title}
                </a>
              </h3>
              <p className="text-gray-400 mb-2">
                <span className="font-semibold">{contest.site.charAt(0).toUpperCase() + contest.site.slice(1)}</span>
              </p>
              <div className="text-gray-400">
                <p>
                  Start Time:{" "}
                  <span className="text-gray-300">
                    {new Date(contest.startTime).toString().replace('India Standard Time','IST')}
                  </span>
                </p>
                <p>
                  Duration:{" "}
                  <span className="text-gray-300">
                    {(contest.site==="leetcode")?Math.floor(contest.duration / 3600000):Math.floor(contest.duration / 60000)} minutes
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingContests;
