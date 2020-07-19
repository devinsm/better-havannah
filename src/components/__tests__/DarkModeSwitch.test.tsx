import React from 'react';
import { render, MockGameController, fireEvent } from 'test-utils';

import DarkModeSwitch from '../DarkModeSwitch';

function assertIsCheckbox(element: HTMLElement, isChecked: boolean): void {
  const isAriaCheckbox = element.getAttribute('role') === 'checkbox';
  const isNativeCheckbox =
    element.nodeName === 'INPUT' && element.getAttribute('type') === 'checkbox';
  expect(isAriaCheckbox || isNativeCheckbox).toBe(true);

  if (isAriaCheckbox) {
    expect(element).toHaveProperty('aria-checked', isChecked);
  } else {
    const switchInput = element as HTMLInputElement;
    if (switchInput.hasAttribute('checked')) {
      expect(switchInput).toHaveProperty('checked', isChecked);
    } else {
      expect(switchInput.value).toBeDefined();
      expect(switchInput.value === (isChecked ? 'true' : '')).toBe(true);
    }
  }
}

// eslint-disable-next-line jest/expect-expect
test('switch is "off" when in light mode', () => {
  const { getByLabelText } = render(
    <DarkModeSwitch
      inDarkMode={false}
      toggleInDarkMode={(): void => {
        // do nothing
      }}
    />,
    {
      services: {
        gameController: MockGameController({ boardSize: 6 })
      }
    }
  );

  const switchElement = getByLabelText(/^dark mode$/i);
  assertIsCheckbox(switchElement, false);
});

// eslint-disable-next-line jest/expect-expect
test('switch is "on" when in dark mode', () => {
  const { getByLabelText } = render(
    <DarkModeSwitch
      inDarkMode={true}
      toggleInDarkMode={(): void => {
        //do nothing
      }}
    />,
    {
      services: {
        gameController: MockGameController({ boardSize: 6 })
      }
    }
  );

  const switchElement = getByLabelText(/^dark mode$/i);
  assertIsCheckbox(switchElement, true);
});

// eslint-disable-next-line jest/expect-expect
test('switch calls "toggleInDarkMode" when clicked', () => {
  const toggleInDarkMode = jest.fn();
  const { getByLabelText } = render(
    <DarkModeSwitch inDarkMode={true} toggleInDarkMode={toggleInDarkMode} />,
    {
      services: {
        gameController: MockGameController({ boardSize: 6 })
      }
    }
  );

  const switchElement = getByLabelText(/^dark mode$/i);
  fireEvent.click(switchElement);
  expect(toggleInDarkMode.mock.calls.length).toBe(1);
});
