import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      marginTop: spacing(1),
      marginLeft: spacing(2)
    },
    label: {}
  });

export interface DarkModeSwitchProps extends WithStyles<typeof styles> {
  inDarkMode: boolean;
  toggleInDarkMode: () => void;
  className?: string;
}

const DarkModeSwitch: React.ComponentType<DarkModeSwitchProps> = ({
  inDarkMode,
  toggleInDarkMode,
  classes,
  className
}: DarkModeSwitchProps) => {
  return (
    <div className={clsx(classes.root, className)}>
      <FormControlLabel
        classes={{ label: classes.label }}
        control={
          <Switch
            size="medium"
            color="primary"
            checked={inDarkMode}
            onChange={toggleInDarkMode}
          />
        }
        label="Dark Mode"
      />
    </div>
  );
};

export default withStyles(styles)(observer(DarkModeSwitch));
