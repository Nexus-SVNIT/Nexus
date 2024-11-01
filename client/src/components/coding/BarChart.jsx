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
    Codeforces: batchData[batch].Codeforces,
    LeetCode: batchData[batch].LeetCode,
    CodeChef: batchData[batch].CodeChef,
  }));

  const legendPayload = [
    { value: "Codeforces", color: "rgba(75, 192, 192, 0.6)" },
    { value: "LeetCode", color: "rgba(153, 102, 255, 0.6)" },
    { value: "CodeChef", color: "rgba(255, 159, 64, 0.6)" },
  ];


  return (
    <div className="mb-10 flex justify-center p-5">
      <ResponsiveContainer width="100%" height={400}> {/* Increased height */}
        <BarChart data={data}>
          <XAxis
            dataKey="batch"
            tick={{ fill: "white" }}
            angle={-90} // Rotate labels for better visibility
            textAnchor="end" // Align text properly
          />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              width: "auto",
              maxWidth: "200px",
            }}
            itemStyle={{ color: "white" }}
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
