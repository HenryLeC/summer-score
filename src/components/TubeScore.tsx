import { Add, Remove } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { CapOptions } from './ScoreForm';

interface TubeScoreProps {
  teamColor: string;
  count: number;
  setCount: (count: number) => void;
  capped: CapOptions;
  setCap: (capped: CapOptions) => void;
}

function TubeScore({
  teamColor,
  count,
  setCount,
  capped,
  setCap,
}: TubeScoreProps) {
  const otherTeam = teamColor === 'red' ? 'blue' : 'red';
  function handleRadioClick(event: any) {
    if (event.target.value === capped) {
      setCap('');
    } else {
      setCap(event.target.value);
    }
  }
  return (
    <>
      <Grid item xs={2}>
        <Typography variant='h4' component='span' color={teamColor}>
          {count}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' onClick={() => setCount(count - 1)}>
          <Remove />
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' onClick={() => setCount(count + 1)}>
          <Add />
        </Button>
      </Grid>
      <Grid item xs={3}>
        <FormControl>
          <FormLabel>Capped</FormLabel>
          <RadioGroup value={capped} row>
            <FormControlLabel
              value='blue'
              control={
                <Radio
                  onClick={handleRadioClick}
                  sx={{
                    '&, &.Mui-checked': {
                      color: 'blue',
                    },
                  }}
                />
              }
              label={undefined}
            />
            <FormControlLabel
              value='red'
              control={
                <Radio
                  onClick={handleRadioClick}
                  sx={{
                    '&, &.Mui-checked': {
                      color: 'red',
                    },
                  }}
                />
              }
              label={undefined}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='h4' component='span' color={teamColor}>
          {(count * 5) * (capped === teamColor ? 2 : 1)}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='h4' component='span' color={otherTeam}>
          {(count * 5) * (capped === otherTeam ? 1 : 0)}
        </Typography>
      </Grid>
    </>
  );
}

export default TubeScore;