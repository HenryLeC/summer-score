import { Button, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';
import { Add, Remove } from '@mui/icons-material';

export type CapOptions = 'blue' | 'red' | '';

export type ScoreData = {
  teamColor: CapOptions;
  cube: number;
  autoCube: number;
  teleCount: number;
  autoPark: boolean;
  endPark: boolean;
  tiltBonus: boolean;
  penalties: number;
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamColor: teamColor as CapOptions,
    cube: 0,
    autoCube: 0,
    teleCount: 0,
    tiltBonus: false,
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
            count={score.autoCube}
            setCount={(count) =>
              setScore({
                ...score,
                autoCube: count,
              })
            }
            teamColor={teamColor}
            title='Auto cube'
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
            count={score.cube}
            setCount={(count) =>
              setScore({
                ...score,
                cube: count,
              })
            }
            teamColor={teamColor}
            title='Cube'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.teleCount}
            setCount={(count) =>
              setScore({
                ...score,
                teleCount: count,
              })
            }
            teamColor={teamColor}
            title='Human Player Cube'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                value={score.tiltBonus}
                onChange={(_, value) => {
                  setScore({
                    ...score,
                    tiltBonus: value,
                  });
                }}
              />
            }
            label="Tilt Bonus?"
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
