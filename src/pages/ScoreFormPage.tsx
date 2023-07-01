import { useParams } from "react-router-dom";
import ScoreForm from "../components/ScoreForm";
import { Typography } from "@mui/material";

function ScoreFormPage() {
  let { teamColor } = useParams();
  return (
    <div style={{ margin: "auto", width: "50%" }}>
      <Typography variant="h2" component="p" style={{ textAlign: "center" }}>
        {teamColor?.toUpperCase() ?? "Team"} Score Form
      </Typography>
      <ScoreForm teamColor={teamColor ?? "black"} />
    </div>
  );
}

export default ScoreFormPage;
