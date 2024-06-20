import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TeamScorePaper from '../components/TeamScorePaper';
import { ScoreData } from '../components/ScoreForm';
import { db } from '..';
import { doc, onSnapshot } from 'firebase/firestore';
import { MatchData } from './ScoreIndex';
import MatchTimer from '../components/MatchTimer';
import FullScreenVideo from '../components/FullScreenVideo';

type FullScore = {
  red: ScoreData | null;
  blue: ScoreData | null;
};

type MatchScores = {
  red: number;
  blue: number;
  winner: string;
};

function ScoreBoard() {
  const [score, setScore] = React.useState<FullScore>({
    red: null,
    blue: null,
  });
  const [matchInProgress, setMatchInProgress] = React.useState<boolean>(false);

  const [match, setMatch] = React.useState<MatchData>({
    name: '',
  });

  const [finished, setFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

    return () => {
      unsubscribeRed();
      unsubscribeBlue();
      unsubscribeRoot();
      unsubscribeFinish();
    };
  }, []);

  const [matchScores, setMatchScores] = React.useState<MatchScores>({
    blue: 0,
    red: 0,
    winner: '',
  });

  useEffect(() => {
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

      score += otherTeam.penalties * 10;

      return score;
    };

    const blueScore = calculateScore(score.blue, score.red);
    const redScore = calculateScore(score.red, score.blue);
    let winner = blueScore > redScore ? 'blue' : 'red';

    if (blueScore === redScore) {
      winner = '';
    }
    if (matchInProgress || finished) {
      setMatchScores({
        blue: blueScore,
        red: redScore,
        winner: winner,
      });
    } else {
      setMatchScores({
        ...matchScores,
        winner: winner,
      });
    }
  }, [score, matchInProgress, finished, matchScores]);

  const [open, setOpen] = useState(false);

  const getLead = (winner: string) => {
    if (winner === 'red') {
      return 'Red Wins';
    } else if (winner === 'blue') {
      return 'Blue Wins';
    } else {
      return "It's a Tie!";
    }
  };

  const getLeadColor = (winner: string) => {
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
        winner={matchScores.winner}
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
            score={matchScores.red}
          />
        </Grid>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor='blue'
            teamName={score.blue?.teamName ?? 'Blue'}
            score={matchScores.blue}
          />
        </Grid>
        {open ? (
          <Grid item xs={12}>
            <MatchTimer setMatchInProgress={setMatchInProgress} />
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
            color: getLeadColor(matchScores.winner),
          }}
        >
          {getLead(matchScores.winner)}
        </Typography>
      )}
    </div>
  );
}

export default ScoreBoard;
