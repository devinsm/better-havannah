import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Services, ServiceContext } from 'services/ServiceContainer';

const getAppWrapper = ({
  services
}: {
  services: Services;
}): React.ComponentType => {
  const AppWrapper = ({
    children
  }: {
    children?: React.ReactNode;
  }): React.ReactElement => (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
  return AppWrapper;
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'queries' | 'wrapper'> & {
    services: Services;
  }
): RenderResult =>
  render(ui, {
    wrapper: getAppWrapper({ services: options.services }),
    ...options
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
