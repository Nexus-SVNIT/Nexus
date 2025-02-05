import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardFour = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    growthRate: 0,
    branchStats: [],
    yearStats: [],
    profileCompletionRate: 0
  });

  const token = localStorage.getItem('core-token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">User Statistics</h2>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-meta-3 bg-opacity-10 text-meta-3">
          {stats.profileCompletionRate}% Profile Completion
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Users Card */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-black dark:text-white">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`flex items-center gap-1 text-sm font-medium ${
              parseFloat(stats.growthRate) > 0 ? 'text-meta-3' : 'text-meta-5'
            }`}>
              {parseFloat(stats.growthRate) > 0 ? '↑' : '↓'} {Math.abs(stats.growthRate)}%
            </span>
            <span className="ml-2 text-xs text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Profile Completion</h3>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${stats.profileCompletionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-meta-3 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Branch and Year Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch Distribution */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Branch Distribution</h3>
          <div className="space-y-2">
            {stats.branchStats.map((branch) => (
              <div key={branch._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <span className="text-sm">{branch._id || 'Unknown'}</span>
                </div>
                <span className="text-sm font-medium">{branch.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Year Distribution */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Year-wise Distribution</h3>
          <div className="space-y-2">
            {stats.yearStats.map((year) => (
              <div key={year._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-meta-5 mr-2" />
                  <span className="text-sm">20{year._id}</span>
                </div>
                <span className="text-sm font-medium">{year.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFour;
