import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import CounterScore from './CounterScore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '..';

export type CapOptions = 'blue' | 'red' | '';

export type ScoreData = {
  teamColor: CapOptions;
  cube: number;
  autoCube: number;
  hpCube: number;
  autoPark: boolean;
  endPark: boolean;
  tiltBonus: boolean;
  penalties: number;
};

interface ScoreFormProps {
  teamColor: string;
}

function HPCount({ teamColor }: ScoreFormProps) {
  const [score, setScore] = useState<ScoreData>({
    teamColor: teamColor as CapOptions,
    cube: 0,
    autoCube: 0,
    hpCube: 0,
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
