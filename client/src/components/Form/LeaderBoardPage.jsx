import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";
import { Box } from "@mui/material";
import incrementCount from "../../libs/increamentCounter";

function LeaderBoardPage() {
  // const { id } = useParams();
  useEffect(() => {
    document.title = "LeaderBoard";
    incrementCount();
  }, []);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
    }}>
      <LeaderBoard />
    </Box>
  );
}

export default LeaderBoardPage;
