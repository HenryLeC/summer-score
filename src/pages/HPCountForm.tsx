import { useParams } from "react-router-dom";
import ScoreForm from "../components/ScoreForm";
import { Typography } from "@mui/material";
import HPCount from "../components/HPCount";

function HPCountForm() {
  let { teamColor } = useParams();
  return (
    <div style={{ margin: "auto", width: "50%" }}>
      <Typography variant="h2" component="p" style={{ textAlign: "center" }}>
        {teamColor?.toUpperCase() ?? "Team"} HP Count Form
      </Typography>
      <HPCount teamColor={teamColor ?? "white"} />
    </div>
  );
}

export default HPCountForm;
