import React from 'react';
import Board from 'components/Board';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useAppStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100%',
      padding: '1px 0'
    }
  })
);
const App: React.ComponentType = () => {
  const styleClasses = useAppStyles();
  return (
    <div className={styleClasses.root}>
      <h1>Havannah</h1>
      <Board />
    </div>
  );
};

export default App;
