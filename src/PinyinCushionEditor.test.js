import React from 'react';
import ReactDOM from 'react-dom';
import PinyinCushionEditor from './PinyinCushionEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PinyinCushionEditor />, div);
});
