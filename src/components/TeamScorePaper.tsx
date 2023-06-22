import { Paper, Typography } from '@mui/material';

interface TeamScorePaperProps {
  teamName: string;
  teamColor: string;
  score: number;
}

function TeamScorePaper({ teamName, teamColor, score }: TeamScorePaperProps) {
  return (
    <Paper elevation={3} style={{ backgroundColor: 'black', color: 'white' }}>
      <center>
        <Typography
          variant='h4'
          component='div'
          color={teamColor}
          style={{
            WebkitTextStroke: '2px white',
          }}
        >
          {teamName}
        </Typography>
        <Typography
          variant='h1'
          component='div'
          color={teamColor}
          style={{
            WebkitTextStroke: '2px white',
          }}
        >
          {score}
        </Typography>
      </center>
    </Paper>
  );
}

export default TeamScorePaper;
