import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';
import { Add, Remove } from '@mui/icons-material';

export type CapOptions = 'blue' | 'red' | '';

export type ClimbType = 'none' | 'climb' | 'touch';

export type ScoreData = {
  teamName: string;
  teamColor: CapOptions;
  scoredAuto: boolean;
  autoClimb: ClimbType;
  endClime: ClimbType;
  cubesPlaced: number;
  ducksScored: number;
  penalties: number;
  spinnedInAuto: boolean;
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamName: '',
    teamColor: teamColor as CapOptions,
    scoredAuto: false,
    autoClimb: 'none',
    endClime: 'none',
    cubesPlaced: 0,
    ducksScored: 0,
    penalties: 0,
    spinnedInAuto: false,
  });

  useEffect(() => {
    setDoc(doc(db, 'realtime', teamColor), score);
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
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.scoredAuto}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    scoredAuto: value,
                  });
                }}
              />
            }
            label="Scored Auto"
          />
        </Grid>
        <Grid item xs={6}>
          <label>Auto Climb</label>
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
            <ToggleButton value="touch">Touch</ToggleButton>
            <ToggleButton value="none">None</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.spinnedInAuto}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    spinnedInAuto: value,
                  });
                }}
              />
            }
            label="Spinned In Auto"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.cubesPlaced}
            setCount={(count) =>
              setScore({
                ...score,
                cubesPlaced: count,
              })
            }
            teamColor={teamColor}
            title="Cubes"
            buttonColor="warning"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.ducksScored}
            setCount={(count) =>
              setScore({
                ...score,
                ducksScored: count,
              })
            }
            teamColor={teamColor}
            title="Ducks!"
            buttonColor="secondary"
          />
        </Grid>

        <Grid item xs={12}>
          <label>End Game Climb</label>
          <div style={{ width: '10px' }} />
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
            <ToggleButton value="touch">Touch</ToggleButton>
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
