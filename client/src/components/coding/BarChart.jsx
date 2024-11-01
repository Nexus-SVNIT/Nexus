import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomBarChart = ({ batchData }) => {
  
  const data = Object.keys(batchData).map((batch) => ({
    batch,
    Codeforces: batchData[batch].Codeforces?.userCount || 0,
    LeetCode: batchData[batch].LeetCode?.userCount || 0,
    CodeChef: batchData[batch].CodeChef?.userCount || 0,
    
  }));

  const legendPayload = [
    { value: "Codeforces", color: "rgba(75, 192, 192, 0.6)" },
    { value: "LeetCode", color: "rgba(153, 102, 255, 0.6)" },
    { value: "CodeChef", color: "rgba(255, 159, 64, 0.6)" },
  ];

  return (
    <div className="mb-10 flex justify-center p-5">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
            dataKey="batch"
            tick={{ fill: "white" }}
            angle={-90}
            textAnchor="end"
          />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const { batch, Codeforces, LeetCode, CodeChef } = payload[0].payload;

              return (
                <div style={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  maxWidth: "200px"
                }}>
                  <h3>Batch {batch}</h3>
                  <p><strong>Codeforces:</strong> {Codeforces} users</p>
                  <p><strong>LeetCode:</strong> {LeetCode} users</p>
                  <p><strong>CodeChef:</strong> {CodeChef} users</p>
                </div>
              );
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
          />
          <Legend payload={legendPayload} />
          <Bar dataKey="Codeforces" fill="rgba(75, 192, 192, 0.6)" />
          <Bar dataKey="LeetCode" fill="rgba(153, 102, 255, 0.6)" />
          <Bar dataKey="CodeChef" fill="rgba(255, 159, 64, 0.6)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
