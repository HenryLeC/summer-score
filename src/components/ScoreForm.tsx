import { Button, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';
import { Add, Remove } from '@mui/icons-material';

export type CapOptions = 'blue' | 'red' | '';

export type ScoreData = {
  teamColor: CapOptions;
  low: number;
  high: number;
  autoHigh: number;
  autoLow: number;
  linkBonus: number;
  autoPark: boolean;
  endPark: boolean;
  penalties: number;
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamColor: teamColor as CapOptions,
    low: 0,
    high: 0,
    autoHigh: 0,
    autoLow: 0,
    linkBonus: 0,
    autoPark: false,
    endPark: false,
    penalties: 0
  });

  useEffect(() => {
    setDoc(doc(db, 'realtime', teamColor), score);
  }, [score, teamColor]);

  return (
    <div>
      <Grid container spacing={5} padding={5} columns={11}>
      <Grid item xs={12}>
          <CounterScore
            count={score.autoLow}
            setCount={(count) =>
              setScore({
                ...score,
                autoLow: count,
              })
            }
            teamColor={teamColor}
            title='auto low'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.autoHigh}
            setCount={(count) =>
              setScore({
                ...score,
                autoHigh: count,
              })
            }
            teamColor={teamColor}
            title='auto high'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.autoPark}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    autoPark: value,
                  });
                }}
              />
            }
            label="Auto Park?"
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.low}
            setCount={(count) =>
              setScore({
                ...score,
                low: count,
              })
            }
            teamColor={teamColor}
            title='low'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.high}
            setCount={(count) =>
              setScore({
                ...score,
                high: count,
              })
            }
            teamColor={teamColor}
            title='high'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.linkBonus}
            setCount={(count) =>
              setScore({
                ...score,
                linkBonus: count,
              })
            }
            teamColor={teamColor}
            title='link bonus'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.endPark}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    endPark: value,
                  });
                }}
              />
            }
            label="Endgame Park?"
          />
        </Grid>

        <Grid item xs={4}>
          <label>Penalties:</label>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h1' component='div' color={teamColor}>
            {score.penalties}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant='contained'
            onClick={() =>
              setScore({ ...score, penalties: score.penalties - 1 })
            }
          >
            <Remove />
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant='contained'
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
