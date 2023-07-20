import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TeamScorePaper from '../components/TeamScorePaper';
import { CapOptions, ClimbType, ScoreData } from '../components/ScoreForm';
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
  pegCone: number;
  groundCone: number;
  pegConeAutoBonus: number;
  groundConeAutoBonus: number;
  ballValue: number;
  ballMultiplier: number;
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
    pegCone: 0,
    groundCone: 0,
    pegConeAutoBonus: 0,
    groundConeAutoBonus: 0,
    ballValue: 0,
    ballMultiplier: 0,
    penalties: 0
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

  const calculateTubeScore = (
    count: number,
    capped: CapOptions,
    team: string
  ) =>
    (count * pointConfig.pegCone) * (capped === team ? 2 : 1) * (capped !== team && capped !== "" ? 0 : 1);

  const calculateScore = (
    team: ScoreData | null,
    otherTeam: ScoreData | null
  ) => {
    if (team === null) {
      return 0;
    }
    let score = 0;



    score += climbScore(team.autoClimb);
    score += climbScore(team.endClime);

    score += calculateTubeScore(
      team.leftPegCones,
      team.leftPegCapped,
      team.teamColor
    );
    
    score += calculateTubeScore(
      team.rightPegCones,
      team.rightPegCapped,
      team.teamColor
    );

    score += team.groundCones * pointConfig.groundCone;
    score += team.groundAutoBonus * pointConfig.groundConeAutoBonus;
    

    score += team.pegAutoBonus * pointConfig.pegConeAutoBonus;


    if (team.ballMultiplier) {
      score += team.balls * pointConfig.ballValue * pointConfig.ballMultiplier;
    }
    else
    {
      score += team.balls * pointConfig.ballValue; 
    }

    if (otherTeam === null) {
      return score;
    }

    if (otherTeam.leftPegCapped === team.teamColor) {
      score += calculateTubeScore(otherTeam.leftPegCones, '', team.teamColor);
    }
    if (otherTeam.rightPegCapped === team.teamColor) {
      score += calculateTubeScore(otherTeam.rightPegCones, '', team.teamColor);
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
            teamColor="red"
            teamName={score.red?.teamName ?? 'Red'}
            score={calculateScore(score.red, score.blue)}
          />
        </Grid>
        <Grid item xs={6}>
          <TeamScorePaper
            teamColor="blue"
            teamName={score.blue?.teamName ?? 'Blue'}
            score={calculateScore(score.blue, score.red)}
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
