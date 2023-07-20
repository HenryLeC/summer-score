import { Card, Typography } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '..';
import useSound from 'use-sound';

type MatchPhase = 'auto' | 'wait' | 'tele' | 'end';

function MatchTimer() {
  const [time, setTime] = useState<number>(30);
  const [started, setStarted] = useState<boolean>(false);
  const [phase, setPhase] = useState<MatchPhase>('auto');

  const [playEnd] = useSound(
    process.env.PUBLIC_URL + '/audio/Match End_normalized.wav'
  );
  const [playAuto] = useSound(
    process.env.PUBLIC_URL + '/audio/Start Auto_normalized.wav'
  );
  const [playStart] = useSound(
    process.env.PUBLIC_URL + '/audio/Start Teleop_normalized.wav'
  );
  const [playEndGame] = useSound(
    process.env.PUBLIC_URL + '/audio/Start of End Game_normalized.wav'
  );

  const ref = useRef<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'realtime', 'timer'), (doc) => {
      if (doc.data()?.start === true) {
        setStarted(true);
        setTime(20);
        setPhase('auto');
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const count = useCallback(() => {
    if (time === 20 && phase === 'auto') {
      console.log('Played Auto Sound');
      playAuto();
    }

    setTime((time) => time - 1);

    if (time === 0) {
      if (phase === 'auto') {
        setTime(5);
        playEnd();
        setPhase('wait');
      } else if (phase === 'wait') {
        setTime(90);
        setPhase('tele');
        playStart();
      } else if (phase === 'tele') {
        setTime(30);
        setPhase('end');
        playEndGame();
      } else if (phase === 'end') {
        setTime(0);
        playEnd();
        setStarted(false);
      }
    }
  }, [phase, time, playAuto, playEnd, playStart, playEndGame]);

  useEffect(() => {
    if (ref.current || !started) clearInterval(ref.current);
    if (!started) return;
    const id = setInterval(() => {
      count();
    }, 1000);
    ref.current = id;
  }, [started, count]);

  return (
    <Card elevation={3} style={{ margin: '0 auto', width: '50%' }}>
      <Typography variant={'h1'} component={'div'} textAlign={'center'}>
        {time}
      </Typography>
    </Card>
  );
}

export default MatchTimer;
