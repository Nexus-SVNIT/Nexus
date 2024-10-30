import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Cp = () => {
  const [userData, setUserData] = useState([]);
  const [batchData, setBatchData] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/all`);
        
        const data = await response.json();
        
        const batchWiseData = {};
        const leaderboardData = [];

        await Promise.all(data.users.map(async (user) => {
          const batch = user.admissionNumber.slice(0, 3); // Extracting batch (e.g., U22, U23)

          // Initialize batch-wise data if it doesn't exist
          if (!batchWiseData[batch]) {
            batchWiseData[batch] = { Codeforces: 0, LeetCode: 0, CodeChef: 0 };
          }

          // Extract usernames from profile URLs
          
          const leetcodeUsername = user.
          leetcodeProfile ? user.leetcodeProfile.split('/').pop() : null;
          const codeforcesUsername = user.codeforcesProfile ? user.codeforcesProfile.split('/').pop() : null;
          console.log(leetcodeUsername);
          

          // Fetch Codeforces data
          if (codeforcesUsername) {
            const cfResponse = await fetch(`https://competeapi.vercel.app/user/codeforces/${codeforcesUsername}`);
            
            const cfData = await cfResponse.json();

            if (cfData.length > 0) {
              const { rating, rank, avatar,} = cfData[0];
              leaderboardData.push({
                fullName: user.fullName,
                codeforcesProfile: user.codeforcesProfile,
                rating,
                rank,
                avatar,
                latestContest: cfData[1].ratings.length ? cfData[1].ratings[0].contestName : "No contests",
                ContestRanking: cfData[1].ratings.length ? cfData[1].ratings[0].rank: "Not given",
              });

              batchWiseData[batch].Codeforces++;
            }
          }

          // Fetch LeetCode data
          if (leetcodeUsername) {
            const lcResponse = await fetch(`https://competeapi.vercel.app/user/leetcode/${leetcodeUsername}`);
            const lcData = await lcResponse.json();
            if (lcData.data) {
              batchWiseData[batch].LeetCode++;
            }
          }

          // Fetch CodeChef data if profile exists
          if (user.codechefProfile) {
            const ccResponse = await fetch(`https://competeapi.vercel.app/user/codechef/${user.codechefProfile.split('/').pop()}`);
            const ccData = await ccResponse.json();
            if (ccData) {
              batchWiseData[batch].CodeChef++;
            }
          }
        }));

        setUserData(data.users);
        setBatchData(batchWiseData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  // Prepare chart data for batch-wise distribution
  const chartData = {
    labels: Object.keys(batchData),
    datasets: [
      {
        label: 'Codeforces',
        data: Object.values(batchData).map(data => data.Codeforces),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'LeetCode',
        data: Object.values(batchData).map(data => data.LeetCode),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'CodeChef',
        data: Object.values(batchData).map(data => data.CodeChef),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div className="App p-6">
      <h1 className="text-3xl font-bold mb-6">User Report by Platform and Batch</h1>
      {/* Batch-wise Platform Data Chart */}
      <Bar data={chartData} options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Batch-wise Platform Data',
          },
        },
      }} />

      <h2 className="text-2xl font-bold mt-8">Leaderboard - Latest Codeforces Contest</h2>
      <table className="min-w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Profile</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">Rank</th>
            <th className="border border-gray-300 px-4 py-2">Latest Contest</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a href={user.codeforcesProfile} target="_blank" rel="noopener noreferrer">Profile</a>
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.rating}</td>
              <td className="border border-gray-300 px-4 py-2">{user.rank}</td>
              <td className="border border-gray-300 px-4 py-2">{user.latestContest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cp;
