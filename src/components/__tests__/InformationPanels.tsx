import React from 'react';
import { render, fireEvent, wait } from 'test-utils';

import InformationPanels from '../InformationPanels';

test('it renders two accordions and they can be opened', async () => {
  const { getByText } = render(<InformationPanels />);

  const rulesAccordionButton = getByText(/rules/i);
  const keyboardShortcutsButton = getByText(/keyboard shortcuts/i);
  const rulesBody = getByText(/Connect Four on steroids/i);
  const keyboardShortcutsBody = getByText(/can use the following shortcuts/i);
  expect(rulesAccordionButton).toBeInTheDocument();
  expect(keyboardShortcutsButton).toBeInTheDocument();
  expect(rulesBody).not.toBeVisible();
  expect(keyboardShortcutsBody).not.toBeVisible();

  fireEvent.click(rulesAccordionButton);
  await wait(() => {
    expect(rulesBody).toBeVisible();
    expect(keyboardShortcutsBody).not.toBeVisible();
  });

  fireEvent.click(keyboardShortcutsButton);
  await wait(() => {
    expect(rulesBody).toBeVisible();
    expect(keyboardShortcutsBody).toBeVisible();
  });

  fireEvent.click(keyboardShortcutsButton);
  await wait(() => {
    expect(rulesBody).toBeVisible();
    expect(keyboardShortcutsBody).not.toBeVisible();
  });

  fireEvent.click(rulesAccordionButton);
  await wait(() => {
    expect(rulesBody).not.toBeVisible();
    expect(keyboardShortcutsBody).not.toBeVisible();
  });
});
