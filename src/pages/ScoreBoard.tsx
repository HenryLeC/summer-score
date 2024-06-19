import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TeamScorePaper from '../components/TeamScorePaper';
import { ScoreData } from '../components/ScoreForm';
import { db } from '..';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { MatchData } from './ScoreIndex';
import MatchTimer from '../components/MatchTimer';
import FullScreenVideo from '../components/FullScreenVideo';

type FullScore = {
  red: ScoreData | null;
  blue: ScoreData | null;
};

type PointsConfig = {
  fullClimb: number;
  touchClimb: number;
  connectValue: number;
  goldenBall: number;
  ballValue: number;
  humanBonus: number;
  autoBonus: number;
  launchpadBonus: number;
  penalties: number;
};

function ScoreBoard() {
  const [score, setScore] = React.useState<FullScore>({
    red: null,
    blue: null,
  });

  const [match, setMatch] = React.useState<MatchData>({
    name: '',
  });

  const [pointConfig, setPointConfig] = React.useState<PointsConfig>({
    fullClimb: 0,
    touchClimb: 0,
    connectValue: 0,
    goldenBall: 0,
    ballValue: 0,
    humanBonus: 0,
    autoBonus: 0,
    launchpadBonus: 0,
    penalties: 0,
  });

  const [finished, setFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const calculateScore = (
    team: ScoreData | null,
    otherTeam: ScoreData | null
  ) => {
    if (team === null) {
      return 0;
    }
    let score = 0;

    score += team.s_5 * 5;
    score += team.s_10 * 10;
    score += team.s_15 * 15;

    if (otherTeam === null) {
      return score;
    }

    score += otherTeam.penalties * pointConfig.penalties;

    return score;
  };

  useEffect(() => {
    const unsubscribeRed = onSnapshot(doc(db, 'realtime', 'red'), (doc) => {
      setScore((score) => ({
        ...score,
        red: (doc.data() as ScoreData) ?? null,
      }));
    });

    const unsubscribeBlue = onSnapshot(doc(db, 'realtime', 'blue'), (doc) => {
      setScore((score) => ({
        ...score,
        blue: (doc.data() as ScoreData) ?? null,
      }));
    });

    const unsubscribeRoot = onSnapshot(doc(db, 'realtime', 'root'), (doc) => {
      setMatch(doc.data() as MatchData);
    });

    const unsubscribeFinish = onSnapshot(
      doc(db, 'realtime', 'timer'),
      (doc) => {
        if (doc.data()?.finished === true) {
          setShowVideo(true);
          setTimeout(() => {
            setFinished(true);
            setOpen(false);
          }, 1000);
        } else if (doc.data()?.finished === false) {
          setFinished(false);
          setOpen(true);
        }
      }
    );

    getDoc(doc(db, 'realtime', 'points')).then((doc) => {
      setPointConfig(doc.data() as PointsConfig);
    });

    return () => {
      unsubscribeRed();
      unsubscribeBlue();
      unsubscribeRoot();
      unsubscribeFinish();
    };
  }, []);

  const [open, setOpen] = useState(false);

  const blueScore = calculateScore(score.blue, score.red);
  const redScore = calculateScore(score.red, score.blue);
  let winner = blueScore > redScore ? 'blue' : 'red';

  if (blueScore === redScore) {
    winner = '';
  }

  const getLead = () => {
    if (winner === 'red') {
      return 'Red Wins';
    } else if (winner === 'blue') {
      return 'Blue Wins';
    } else {
      return "It's a Tie!";
    }
  };

  const getLeadColor = () => {
    if (winner === '') {
      return 'purple';
    }

    return winner;
  };

  return (
    <div>
      <FullScreenVideo
        showVideo={showVideo}
        setShowVideo={setShowVideo}
        winner={winner}
      />
      <center>
        <Typography variant='h2' component='div'>
          {match.name}
        </Typography>
      </center>

      <Grid container spacing={10} padding={10}>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor='red'
            teamName={score.red?.teamName ?? 'Red'}
            score={redScore}
          />
        </Grid>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor='blue'
            teamName={score.blue?.teamName ?? 'Blue'}
            score={blueScore}
          />
        </Grid>
        {open ? (
          <Grid item xs={12}>
            <MatchTimer />
          </Grid>
        ) : (
          <div onClick={() => setOpen(true)}>Open Timer</div>
        )}
      </Grid>
      {finished && (
        <Typography
          variant='h2'
          sx={{
            textAlign: 'center',
            fontSize: '75px',
            color: getLeadColor(),
          }}
        >
          {getLead()}
        </Typography>
      )}
    </div>
  );
}

export default ScoreBoard;
