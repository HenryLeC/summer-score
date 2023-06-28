import { Add, Remove } from '@mui/icons-material';
import { Button, Grid, Typography } from '@mui/material';

interface CounterScoreProps {
  teamColor: string;
  count: number;
  setCount: (count: number) => void;
  title: string;
  buttonColor: any;
}

function CounterScore({
  teamColor,
  count,
  setCount,
  title,
  buttonColor,
}: CounterScoreProps) {
  return (
    <>
      <label>{title}</label>

      <Grid item xs={2}>
        <Typography variant="h4" component="span" color={teamColor}>
          {count}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Button
          disabled={count === 0}
          variant="contained"
          onClick={() => setCount(count - 1)}
          color={buttonColor}
        >
          <Remove />
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          onClick={() => setCount(count + 1)}
          color={buttonColor}
        >
          <Add />
        </Button>
      </Grid>
    </>
  );
}

export default CounterScore;
