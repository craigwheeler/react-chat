import React from 'react';
import ReactDOM from 'react-dom';
import ReactChat from '../components/ReactChat';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReactChat />, div);
  ReactDOM.unmountComponentAtNode(div);
});
