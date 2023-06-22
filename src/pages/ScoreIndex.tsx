import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '..';
import { Link } from 'react-router-dom';

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
      </center>
    </div>
  );
}

export default ScoreIndex;
