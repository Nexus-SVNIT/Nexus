import React from "react";
// import { useParams } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";
import { Box } from "@mui/material";

function LeaderBoardPage() {
  // const { id } = useParams();
  return (
    <Box sx={{ 
      minHeight: '100vh',
    }}>
      <title>LeaderBoard</title>
      <LeaderBoard />
    </Box>
  );
}

export default LeaderBoardPage;
