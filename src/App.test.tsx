// import dependencies
import React from 'react';

// import react-testing methods
import { render } from 'test-utils';
import App from 'App';
import { Services } from 'services/ServiceContainer';

const getMockServices = (): Services => ({
  gameController: null
});

let mockServices: Services = getMockServices();

beforeEach(() => {
  mockServices = getMockServices();
});

test('loads main heading', () => {
  const { getByRole } = render(<App />, {
    services: mockServices
  });
  expect(getByRole('heading')).toHaveTextContent('Havannah');
});
