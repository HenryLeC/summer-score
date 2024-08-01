import { Paper, Typography } from "@mui/material";
import HPCount from "./HPCount";

interface TeamScorePaperProps {
  teamName: string;
  teamColor: string;
  score: number;
  hpCube: number
}

function TeamScorePaper({ teamName, teamColor, score, hpCube}: TeamScorePaperProps) {
  return (
    <Paper elevation={6} style={{ backgroundColor: "black", color: "white" }}>
      <center>
        <Typography
          variant="h3"
          component="div"
          color={teamColor}
          style={{
            WebkitTextStroke: "2px white",
          }}
        >
          {teamName}
        </Typography>

        <Typography
          variant="h1"
          component="div"
          color={teamColor}
          style={{
            WebkitTextStroke: "2px white",
          }}
        >
          {score}
        </Typography>

        <Typography
          variant="h4"
          component="div"
          color={"white"}
          style={{
            WebkitTextStroke: "2px white",
          }}
        > ______________
          <div className="top-element-formatting">
          </div>

        </Typography>

        <Typography
          variant="h4"
          component="div"
          color={teamColor}
          style={{
            WebkitTextStroke: "2px white",
          }}
        >
          {"HP Cubes"}
        </Typography>

        <Typography
          variant="h4"
          component="div"
          color={teamColor}
          style={{
            WebkitTextStroke: "2px white",
          }}
        >
          {hpCube}
        </Typography>
      </center>
    </Paper>
  );
}

export default TeamScorePaper;
