import React from 'react';
import { render } from 'test-utils';

import GitHubLink from '../GitHubLink';

test('it renders a link to the github page', () => {
  const { getByLabelText } = render(<GitHubLink />);

  const link = getByLabelText(/github repo/i);
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute(
    'href',
    'https://github.com/devinsm/better-havannah'
  );
});
