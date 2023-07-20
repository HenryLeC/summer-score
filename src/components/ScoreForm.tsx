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
import TubeScore from './TubeScore';

export type CapOptions = 'blue' | 'red' | '';

export type ClimbType = 'none' | 'climb' | 'touch';

export type ScoreData = {
  teamName: string;
  teamColor: CapOptions;
  autoClimb: ClimbType;
  endClime: ClimbType;
  leftPegCones: number;
  leftPegCapped: CapOptions;
  rightPegCones: number;
  rightPegCapped: CapOptions;
  groundCones: number;
  pegAutoBonus: number;
  groundAutoBonus: number;
  balls: number;
  ballMultiplier: boolean;
  penalties: number;
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamName: '',
    teamColor: teamColor as CapOptions,
    autoClimb: 'none',
    endClime: 'none',
    leftPegCones: 0,
    leftPegCapped: '',
    rightPegCones: 0,
    rightPegCapped: '',
    groundCones: 0,
    pegAutoBonus: 0,
    groundAutoBonus: 0,
    balls: 0,
    ballMultiplier: false,
    penalties: 0
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
                value={score.ballMultiplier}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    ballMultiplier: value,
                  });
                }}
              />
            }
            label="Ball Multiplier"
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

        <Grid item xs={12}>
          <CounterScore
            count={score.groundAutoBonus}
            setCount={(count) =>
              setScore({
                ...score,
                groundAutoBonus: count,
              })
            }
            teamColor={teamColor}
            title="Ground Auto Bonus"
            buttonColor="warning"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.pegAutoBonus}
            setCount={(count) =>
              setScore({
                ...score,
                pegAutoBonus: count,
              })
            }
            teamColor={teamColor}
            title="Peg Auto Bonus"
            buttonColor="secondary"
          />
        </Grid>

        <>
          <TubeScore
            count={score.leftPegCones}
            setCount={(count) =>
              setScore({
                ...score,
                leftPegCones: count,
              })
            }
            capped={score.leftPegCapped}
            setCap={(capped) =>
              setScore({
                ...score,
                leftPegCapped: capped,
              })
            }
            teamColor={teamColor}
          />
          <div style={{ height: '10px' }} />
          <TubeScore
            count={score.rightPegCones}
            setCount={(count) =>
              setScore({
                ...score,
                rightPegCones: count,
              })
            }
            capped={score.rightPegCapped}
            setCap={(capped) =>
              setScore({
                ...score,
                rightPegCapped: capped,
              })
            }
            teamColor={teamColor}
          />

        </>

        <Grid item xs={12}>
          <CounterScore
            count={score.balls}
            setCount={(count) =>
              setScore({
                ...score,
                balls: count,
              })
            }
            teamColor={teamColor}
            title="Balls"
            buttonColor="warning"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.groundCones}
            setCount={(count) =>
              setScore({
                ...score,
                groundCones: count,
              })
            }
            teamColor={teamColor}
            title="Ground Cones"
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
