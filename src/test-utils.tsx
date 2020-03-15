import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Services, ServiceContext } from 'services/ServiceContainer';
import { ThemeProvider, Theme } from '@material-ui/core/styles';

const getAppWrapper = ({
  services,
  theme
}: {
  services: Services;
  theme?: Theme;
}): React.ComponentType => {
  const AppWrapper = ({
    children
  }: {
    children?: React.ReactNode;
  }): React.ReactElement => {
    const wrappedInServices = (
      <ServiceContext.Provider value={services}>
        {children}
      </ServiceContext.Provider>
    );
    if (theme) {
      return <ThemeProvider theme={theme}>{wrappedInServices}</ThemeProvider>;
    }
    return wrappedInServices;
  };
  return AppWrapper;
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'queries' | 'wrapper'> & {
    services: Services;
    theme: Theme;
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
