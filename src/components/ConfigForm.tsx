import React, { useContext } from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import {
  Typography,
  FormControl,
  Select,
  InputLabel,
  Button,
  Grid
} from '@material-ui/core';
import { observer } from 'mobx-react';

import { ServiceContext, Services } from 'services/ServiceContainer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {},
    heading: {
      marginBottom: spacing(3)
    },
    boardSizeSelect: {
      width: '100%',
      background: palette.background.paper
    }
  });

export type ConfigFormProps = WithStyles<typeof styles>;

const ConfigForm: React.ComponentType<ConfigFormProps> = ({
  classes
}: ConfigFormProps) => {
  const { gameController } = useContext(ServiceContext) as Services;
  const sizeOptions = [];
  for (let i = 4; i < 11; i++) {
    sizeOptions.push(i);
  }

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ): void => {
    gameController.setBoardSize(+(event.target.value as string));
  };

  const handleStartGame = (): void => {
    gameController.startGame();
  };
  // Needs to be used two places due to particularity with MUI
  const boardSizeSelectLabel = 'Board Size';
  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.heading}>
        To begin select a board size!
      </Typography>
      <Grid container component="form" spacing={6}>
        <Grid item xs={6}>
          <FormControl
            variant="outlined"
            size="small"
            className={classes.boardSizeSelect}
          >
            <InputLabel htmlFor="board-size-select">
              {boardSizeSelectLabel}
            </InputLabel>
            <Select
              native
              inputProps={{
                id: 'board-size-select'
              }}
              label={boardSizeSelectLabel}
              value={gameController.board.size}
              onChange={handleChange}
            >
              {sizeOptions.map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={handleStartGame}
            variant="contained"
            color="primary"
            size="large"
          >
            Start Game
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(observer(ConfigForm));
