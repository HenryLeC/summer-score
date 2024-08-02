import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';

export type CapOptions = 'blue' | 'red' | '';

export type HPData = {
  teamColor: CapOptions;
  hpCube: number;
};

interface HPFormProps {
  teamColor: string;
}

function HPCount({ teamColor }: HPFormProps) {
  const [score, setScore] = useState<HPData>({
    teamColor: teamColor as CapOptions,
    hpCube: 0,
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
