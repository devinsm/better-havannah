import React, { useContext } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  FormControl,
  NativeSelect,
  InputLabel,
  Button
} from '@material-ui/core';
import { observer } from 'mobx-react';

import { ServiceContext, Services } from 'services/ServiceContainer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    root: {}
  });

export type ConfigFormProps = WithStyles<typeof styles>;

const ConfigForm: React.ComponentType<ConfigFormProps> = ({
  classes
}: ConfigFormProps) => {
  const { gameController } = useContext(ServiceContext) as Services;
  const sizeOptions = [];
  for (let i = 5; i < 11; i++) {
    sizeOptions.push(i);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    gameController.setBoardSize(+event.target.value);
  };
  return (
    <div className={classes.root}>
      <Typography variant="h2">To begin select a board size!</Typography>
      <form>
        <FormControl>
          <InputLabel htmlFor="board-size-select">Board Size</InputLabel>
          <NativeSelect
            id="board-size-select"
            value={gameController.board.size}
            onChange={handleChange}
          >
            {sizeOptions.map(option => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        <Button>Start Game</Button>
      </form>
    </div>
  );
};

export default withStyles(styles)(observer(ConfigForm));
