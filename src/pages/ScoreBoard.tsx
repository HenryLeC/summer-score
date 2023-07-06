import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TeamScorePaper from '../components/TeamScorePaper';
import { ClimbType, ScoreData } from '../components/ScoreForm';
import { db } from '..';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { MatchData } from './ScoreIndex';
import MatchTimer from '../components/MatchTimer';

type FullScore = {
  red: ScoreData | null;
  blue: ScoreData | null;
};

type PointsConfig = {
  fullClimb: number;
  touchClimb: number;
  scoredInAuto: number;
  spinnedInAuto: number;
  cubeValue: number;
  duckValue: number;
  penalties: number;
  tipBonus: number;
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
    scoredInAuto: 0,
    spinnedInAuto: 0,
    cubeValue: 0,
    duckValue: 0,
    penalties: 0,
    tipBonus: 0,
  });

  const climbScore = (climb: ClimbType) => {
    switch (climb) {
      case 'climb':
        return pointConfig.fullClimb;
      case 'touch':
        return pointConfig.touchClimb;
      default:
        return 0;
    }
  };

  const calculateScore = (
    team: ScoreData | null,
    otherTeam: ScoreData | null
  ) => {
    if (team === null) {
      return 0;
    }
    let score = 0;
    score += team.scoredAuto ? pointConfig.scoredInAuto : 0;
    score += team.spinnedInAuto ? pointConfig.spinnedInAuto : 0;
    score += climbScore(team.autoClimb);
    score += climbScore(team.endClime);

    score += team.cubesPlaced * pointConfig.cubeValue;
    score += team.ducksScored * pointConfig.duckValue;

    if (team.tipBonus) {
      score += pointConfig.tipBonus;
    }

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

    getDoc(doc(db, 'realtime', 'points')).then((doc) => {
      setPointConfig(doc.data() as PointsConfig);
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
        <Typography variant="h2" component="div">
          {match.name}
        </Typography>
      </center>
      <Grid container spacing={10} padding={10}>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor="blue"
            teamName={score.blue?.teamName ?? 'Blue'}
            score={calculateScore(score.blue, score.red)}
          />
        </Grid>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor="red"
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
