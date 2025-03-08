import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";
import { Box } from "@mui/material";
import incrementCount from "../../libs/increamentCounter";
import HeadTags from "../HeadTags/HeadTags";

function LeaderBoardPage() {
  // const { id } = useParams();
  useEffect(() => {
    document.title = "LeaderBoard";
    incrementCount();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <HeadTags
        title={"Merch Referral LeaderBoard | Nexus - NIT Surat"}
        description={"LeaderBoard for Merch Referral in Nexus"}
      />
      <LeaderBoard />
    </Box>
  );
}

export default LeaderBoardPage;
