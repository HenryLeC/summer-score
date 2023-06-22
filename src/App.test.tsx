import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreBoard from './pages/ScoreBoard';

test('renders learn react link', () => {
  render(<ScoreBoard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
