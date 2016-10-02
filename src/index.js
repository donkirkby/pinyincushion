import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import PinyinCushionEditor from './PinyinCushionEditor';
import './style.screen.css';
import './style.print.css';


ReactDOM.render(
        <PinyinCushionEditor />,
    document.getElementById('pinyin-cushion-app')
);
