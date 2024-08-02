import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '..';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { CapOptions } from '../components/ScoreForm';

export type MatchData = {
  name: string;
  red_name: string;
  blue_name: string;
};

function ScoreIndex() {
  const [match, setMatch] = useState<MatchData>({
    name: '',
    red_name: '',
    blue_name: '',
  });

  useEffect(() => {
    setDoc(doc(db, 'realtime', 'root'), match);
  }, [match]);

  return (
    <div>
      <center>
        <h1>Score Index</h1>
        <input
          type='text'
          placeholder='Match Name'
          value={match.name}
          onChange={(e) => setMatch({ ...match, name: e.target.value })}
        />
        <input
          type='text'
          placeholder='Red Team Name'
          value={match.red_name}
          onChange={(e) => setMatch({ ...match, red_name: e.target.value })}
        />
        <input
          type='text'
          placeholder='Blue Team Name'
          value={match.blue_name}
          onChange={(e) => setMatch({ ...match, blue_name: e.target.value })}
        />
        <br />
        <Link to='/score/red'>Red</Link>
        <br />
        <Link to='/score/blue'>Blue</Link>
        <br />

        <Button
          onClick={() => {
            setDoc(doc(db, 'realtime', 'timer'), { start: true });
            setTimeout(() => {
              setDoc(doc(db, 'realtime', 'timer'), { start: false });
            }, 5000);
          }}
        >
          Start Match
        </Button>
        <br />

        <Button
          onClick={() => {
            setDoc(doc(db, 'realtime', 'timer'), { finished: true });
          }}
        >
          Finish Round
        </Button>

        <Button
          onClick={() => {
            setDoc(doc(db, 'realtime', 'timer'), { finished: false });
            setDoc(doc(db, 'realtime', 'red'), {
              teamColor: 'red' as CapOptions,
              cube: 0,
              heavyCube: 0,
              autoCube: 0,
              hpCube: 0,
              endPark: false,
              autoPark: false,
              tiltBonus: false,
              penalties: 0,
            });
            setDoc(doc(db, 'realtime', 'blue'), {
              teamColor: 'blue' as CapOptions,
              cube: 0,
              heavyCube: 0,
              autoCube: 0,
              hpCube: 0,
              endPark: false,
              autoPark: false,
              tiltBonus: false,
              penalties: 0,
            });
          }}
        >
          Restart Round
        </Button>
      </center>
    </div>
  );
}

export default ScoreIndex;
