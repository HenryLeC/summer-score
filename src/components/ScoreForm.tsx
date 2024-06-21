import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';
import { Add, Remove } from '@mui/icons-material';

export type CapOptions = 'blue' | 'red' | '';

export type ScoreData = {
  teamColor: CapOptions;
  s_5: number;
  s_10: number;
  s_15: number;
  penalties: number;
};

interface ScoreFormProps {
  teamColor: string;
}

function ScoreForm({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamColor: teamColor as CapOptions,
    s_5: 0,
    s_10: 0,
    s_15: 0,
    penalties: 0,
  });

  useEffect(() => {
    setDoc(doc(db, 'realtime', teamColor), score);
  }, [score, teamColor]);

  return (
    <div>
      <Grid container spacing={5} padding={10} columns={13}>
        <Grid item xs={12}>
          <CounterScore
            count={score.s_5}
            setCount={(count) =>
              setScore({
                ...score,
                s_5: count,
              })
            }
            teamColor={teamColor}
            title='5'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.s_10}
            setCount={(count) =>
              setScore({
                ...score,
                s_10: count,
              })
            }
            teamColor={teamColor}
            title='10'
            buttonColor='secondary'
          />
        </Grid>

        <Grid item xs={12}>
          <CounterScore
            count={score.s_15}
            setCount={(count) =>
              setScore({
                ...score,
                s_15: count,
              })
            }
            teamColor={teamColor}
            title='15'
            buttonColor='secondary'
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
