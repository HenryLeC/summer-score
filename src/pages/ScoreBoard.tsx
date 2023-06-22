import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TeamScorePaper from '../components/TeamScorePaper';
import { CapOptions, ClimbType, ScoreData } from '../components/ScoreForm';
import { db } from '..';
import { doc, onSnapshot } from 'firebase/firestore';
import { MatchData } from './ScoreIndex';
import MatchTimer from '../components/MatchTimer';

type FullScore = {
  red: ScoreData | null;
  blue: ScoreData | null;
};

function ScoreBoard() {
  const [score, setScore] = React.useState<FullScore>({
    red: null,
    blue: null,
  });

  const [match, setMatch] = React.useState<MatchData>({
    name: '',
  });

  const climbScore = (climb: ClimbType) => {
    switch (climb) {
      case 'climb':
        return 10;
      case 'touch':
        return 5;
      default:
        return 0;
    }
  };

  const calculateTubeScore = (
    count: number,
    capped: CapOptions,
    team: string
  ) =>
    (count * count + 3 * count) * (capped === team ? 2 : 1) +
    (capped === team ? 10 : 0);

  const calculateScore = (
    team: ScoreData | null,
    otherTeam: ScoreData | null
  ) => {
    if (team === null) {
      return 0;
    }
    let score = 0;
    score += team.scoredAuto ? 5 : 0;
    score += climbScore(team.autoClimb);
    score += climbScore(team.endClime);
    score += calculateTubeScore(
      team.farTubeBalls,
      team.farTubeCapped,
      team.teamColor
    );
    score += calculateTubeScore(
      team.midTubeBalls,
      team.midTubeCapped,
      team.teamColor
    );
    score += calculateTubeScore(
      team.closeTubeBalls,
      team.closeTubeCapped,
      team.teamColor
    );

    if (otherTeam === null) {
      return score;
    }

    score += otherTeam.penalties * 5;

    if (otherTeam.farTubeCapped === team.teamColor) {
      score += calculateTubeScore(otherTeam.farTubeBalls, '', team.teamColor);
    }
    if (otherTeam.midTubeCapped === team.teamColor) {
      score += calculateTubeScore(otherTeam.midTubeBalls, '', team.teamColor);
    }
    if (otherTeam.closeTubeCapped === team.teamColor) {
      score += calculateTubeScore(otherTeam.closeTubeBalls, '', team.teamColor);
    }
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

    return () => {
      unsubscribeRed();
      unsubscribeBlue();
      unsubscribeRoot();
    };
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <div>
      <center>
        <Typography variant='h2' component='div'>
          {match.name}
        </Typography>
      </center>
      <Grid container spacing={10} padding={10}>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor='blue'
            teamName={score.blue?.teamName ?? 'Blue'}
            score={calculateScore(score.blue, score.red)}
          />
        </Grid>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor='red'
            teamName={score.red?.teamName ?? 'Red'}
            score={calculateScore(score.red, score.blue)}
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
    </div>
  );
}

export default ScoreBoard;
