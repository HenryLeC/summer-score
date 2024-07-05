import { Card, Typography } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '..';
import useSound from 'use-sound';

type MatchPhase = 'auto' | 'wait' | 'tele' | 'end';

interface MatchTimerProps {
  setMatchInProgress: (arg0: boolean) => void;
}

function MatchTimer({ setMatchInProgress }: MatchTimerProps) {
  const [time, setTime] = useState<number>(30);
  const [started, setStarted] = useState<boolean>(false);
  const [phase, setPhase] = useState<MatchPhase>('auto');

  const [playEnd] = useSound(
    process.env.PUBLIC_URL + '/audio/Match End_normalized.wav'
  );
  const [playAuto] = useSound(
    process.env.PUBLIC_URL + '/audio/Start Auto_normalized.wav'
  );
  const [playDriversPickUp] = useSound(
    process.env.PUBLIC_URL + '/audio/Drivers_Pick_Up.mp3'
  );
  const [playEndAuto] = useSound(
    process.env.PUBLIC_URL + '/audio/End_Auto.mp3'
  );
  const [play321] = useSound(process.env.PUBLIC_URL + '/audio/3_2_1.mp3');
  const [playEndGame] = useSound(
    process.env.PUBLIC_URL + '/audio/Start of End Game.mp3'
  );

  const ref = useRef<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'realtime', 'timer'), (doc) => {
      if (doc.data()?.start === true) {
        setStarted(true);
        setMatchInProgress(true);
        setTime(45);
        setPhase('auto');
      }
    });

    return () => {
      unsub();
    };
  }, [setMatchInProgress]);

  const count = useCallback(() => {
    setTime((time) => time - 1);

    if (time === 1) {
      if (phase === 'auto') {
        setTime(75);
        playEndAuto();
        setPhase('tele');
      } else if (phase === 'wait') {
        setTime(75);
        setPhase('tele');
        //playStart();
      } else if (phase === 'end') {
        setTime(0);
        setMatchInProgress(false);
        playEnd();
        setStarted(false);
      }
    }

    // if (time === 7 && phase === 'wait') {
    //   playDriversPickUp();
    // }

    // if (time === 4 && phase === 'wait') {
    //   play321();
    // }

    if (time === 16 && phase === 'tele') {
      setPhase('end');
      playEndGame();
    }
  }, [
    phase,
    time,
    playEndAuto,
    play321,
    playDriversPickUp,
    playEnd,
    playEndGame,
    setMatchInProgress,
  ]);

  useEffect(() => {
    if (ref.current || !started) {
      clearInterval(ref.current);
    }
    if (!started) return;

    if (time === 30 && phase === 'auto') {
      console.log('Played Auto Sound');
      playAuto();
    }

    const id = setInterval(() => {
      count();
    }, 1000);
    ref.current = id;
  }, [started, count, phase, playAuto, time]);

  return (
    <Card elevation={3} style={{ margin: '0 auto', width: '50%' }}>
      <Typography variant={'h1'} component={'div'} textAlign={'center'}>
        {time}
      </Typography>
    </Card>
  );
}

export default MatchTimer;
