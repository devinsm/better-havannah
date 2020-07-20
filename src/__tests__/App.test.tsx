import React from 'react';
import { render } from 'test-utils';

import App from '../App';

// Basic smoke test. Each component has in depth unit tests
// See src/components/__tests__
test('it renders', () => {
  const { getByText } = render(<App />);

  expect(
    getByText(/havannah/i, {
      selector: 'h1'
    })
  ).toBeInTheDocument();
});
