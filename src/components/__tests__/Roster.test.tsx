import React from 'react';
import { render } from 'test-utils';

import Roster from '../Roster';

test('it renders a link to the github page', () => {
  const { getByText } = render(<Roster />);

  const heading = getByText(/players/i);
  expect(heading).toBeInTheDocument();
  expect(heading.nodeName).toBe('H2');

  const playerOne = getByText(/one/i);
  const playerTwo = getByText(/two/i);
  expect(playerOne).toBeInTheDocument();
  expect(playerTwo).toBeInTheDocument();
});
