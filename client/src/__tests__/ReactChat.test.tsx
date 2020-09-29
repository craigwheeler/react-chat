import React from 'react';
import { render } from '@testing-library/react';
import ReactChat from '../components/ReactChat';

describe('React Chat', () => {
  it('renders without crashing', () => {
    const element_tree = render(<ReactChat />).container;
    expect(element_tree).toMatchSnapshot();
  });
});
