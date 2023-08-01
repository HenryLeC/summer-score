import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CounterScore from "./CounterScore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "..";
import { Add, Remove } from "@mui/icons-material";

export type CapOptions = "blue" | "red" | "";

export type ClimbType = "none" | "climb" | "touch";

export type ScoreData = {
  teamName: string;
  teamColor: CapOptions;
  autoClimb: ClimbType;
  endClime: ClimbType;
  goldenBall: boolean;
  humanBonus: number;
  autoBonus: number;
  penalties: number;
  redRocket: boolean[];
  blackRocket: boolean[];
  blueRocket: boolean[];
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamName: "",
    teamColor: teamColor as CapOptions,
    autoClimb: "none",
    endClime: "none",
    goldenBall: false,
    humanBonus: 0,
    autoBonus: 0,
    penalties: 0,
    redRocket: [false, false, false, false, false, false],
    blackRocket: [false, false, false, false, false, false],
    blueRocket: [false, false, false, false, false, false],
  });

  useEffect(() => {
    setDoc(doc(db, "realtime", teamColor), score);
  }, [score, teamColor]);

  return (
    <div>
      <Grid container spacing={5} padding={10} columns={13}>
        <Grid item xs={12}>
          <TextField
            value={score.teamName}
            onChange={(event) => {
              setScore({
                ...score,
                teamName: event.target.value,
              });
            }}
            label="Team Name"
          />
        </Grid>

        <Grid item xs={12}>
          <label>Auto Climb</label>
          <div style={{ width: "10px" }} />
          <ToggleButtonGroup
              value={score.autoClimb}
              exclusive
              onChange={(_, value) => {
                setScore({
                  ...score,
                  autoClimb: value as ClimbType,
                });
              }}
            >
              <ToggleButton value="climb">Climb</ToggleButton>
              {/* <ToggleButton value="touch">Touch</ToggleButton> */}
              <ToggleButton value="none">None</ToggleButton>
            </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.autoBonus}
            setCount={(count) =>
              setScore({
                ...score,
                autoBonus: count,
              })
            }
            teamColor={teamColor}
            title="Auto Bonus"
            buttonColor="secondary"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.humanBonus}
            setCount={(count) =>
              setScore({
                ...score,
                humanBonus: count,
              })
            }
            teamColor={teamColor}
            title="Human Bonus"
            buttonColor="warning"
          />
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            "& > *": {
              m: 1,
            },
          }}
        >
          <ButtonGroup orientation="vertical">
            <Button disabled>Blue</Button>
            {score.blueRocket.map((value, index) => (
              <Button
                key={`${index}`}
                variant={value ? "contained" : "outlined"}
                onClick={() => {
                  const copy = score.blueRocket;
                  copy[index] = !copy[index];

                  setScore({
                    ...score,
                    blueRocket: copy,
                  });
                }}
              >
                {6 - index}
              </Button>
            ))}
          </ButtonGroup>

          <ButtonGroup orientation="vertical" color="warning">
            <Button disabled color="warning">
              Black
            </Button>
            {score.blackRocket.map((value, index) => (
              <Button
                key={`${index}`}
                variant={value ? "contained" : "outlined"}
                onClick={() => {
                  const copy = score.blackRocket;
                  copy[index] = !copy[index];

                  setScore({
                    ...score,
                    blackRocket: copy,
                  });
                }}
              >
                {6 - index}
              </Button>
            ))}
          </ButtonGroup>

          <ButtonGroup orientation="vertical" color="error">
            <Button disabled color="warning">
              Red
            </Button>
            {score.redRocket.map((value, index) => (
              <Button
                key={`${index}`}
                variant={value ? "contained" : "outlined"}
                onClick={() => {
                  const copy = score.redRocket;
                  copy[index] = !copy[index];

                  setScore({
                    ...score,
                    redRocket: copy,
                  });
                }}
              >
                {6 - index}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.goldenBall}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    goldenBall: value,
                  });
                }}
              />
            }
            label="Golden Ball"
          />
        </Grid>

        <Grid item xs={12}>
          <label>End Game Climb</label>
          <div style={{ width: "10px" }} />
          <ToggleButtonGroup
            value={score.endClime}
            exclusive
            onChange={(_, value) => {
              setScore({
                ...score,
                endClime: value as ClimbType,
              });
            }}
          >
            <ToggleButton value="climb">Climb</ToggleButton>
            {/* <ToggleButton value="touch">Touch</ToggleButton> */}
            <ToggleButton value="none">None</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={4}>
          <label>Penalties:</label>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h1" component="div" color={teamColor}>
            {score.penalties}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={() =>
              setScore({ ...score, penalties: score.penalties - 1 })
            }
          >
            <Remove />
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={() =>
              setScore({ ...score, penalties: score.penalties + 1 })
            }
          >
            <Add />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ScoreForm;