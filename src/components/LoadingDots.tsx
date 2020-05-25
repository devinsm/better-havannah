import React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { Typography, TypographyProps } from '@material-ui/core';
import { observer } from 'mobx-react';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    // https://martinwolf.org/before-2018/blog/2015/01/pure-css-savingloading-dots-animation/
    '@keyframes blink': {
      '0%': {
        opacity: '.2'
      },
      '20%': {
        opacity: '1'
      },
      '100%': {
        opacity: '.2'
      }
    },
    root: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      color: 'inherit',
      '& span': {
        animationName: '$blink',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationFillMode: 'both'
      },
      '& span:nth-child(2)': {
        animationDelay: '.2s'
      },
      '& span:nth-child(3)': {
        animationDelay: '.4s'
      }
    }
  });

export type LoadingDotsProps = WithStyles<typeof styles> & TypographyProps;

const LoadingDots: React.ComponentType<LoadingDotsProps> = ({
  classes,
  className,
  ...otherProps
}: LoadingDotsProps) => {
  return (
    <Typography
      className={clsx(classes.root, className)}
      component="span"
      {...otherProps}
    >
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </Typography>
  );
};

export default withStyles(styles)(observer(LoadingDots));
