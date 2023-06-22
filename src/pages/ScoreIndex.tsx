import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '..';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export type MatchData = {
  name: string;
};

function ScoreIndex() {
  const [match, setMatch] = useState<MatchData>({
    name: '',
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
          value={match.name}
          onChange={(e) => setMatch({ name: e.target.value })}
        />
        <br />
        <Link to='/score/red'>Red</Link>
        <br />
        <Link to='/score/blue'>Blue</Link>

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
      </center>
    </div>
  );
}

export default ScoreIndex;
