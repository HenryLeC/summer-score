import { Button, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';
import { Add, Remove } from '@mui/icons-material';
import HPCountForm from '../pages/HPCountForm';

export type CapOptions = 'blue' | 'red' | '';

export type ScoreData = {
  teamColor: CapOptions;
  hpCube: number;
  tiltBonus: boolean;
};

interface ScoreFormProps {
  teamColor: string;
}

function HPCount({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamColor: teamColor as CapOptions,
    hpCube: 0,
    tiltBonus: false
  });

  useEffect(() => {
    setDoc(doc(db, 'realtime', teamColor), score);
  }, [score, teamColor]);

  return (
    <div>
      <Grid container spacing={5} padding={5} columns={11}>


        <Grid item xs={12}>
          <CounterScore
            count={score.hpCube}
            setCount={(count) =>
              setScore({
                ...score,
                hpCube: count,
              })
            }
            teamColor={teamColor}
            title='Human Player Cube'
            buttonColor='secondary'
          />
        </Grid>

      </Grid>
    </div>
  );
}

export default HPCount;
