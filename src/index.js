import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'draft-js/dist/Draft.css';

import PinyinCushionEditor from './PinyinCushionEditor';
import './static/css/style.screen.css';
import './static/css/style.print.css';


ReactDOM.render(
        <PinyinCushionEditor />,
    document.getElementById('pinyin-cushion-app')
);
