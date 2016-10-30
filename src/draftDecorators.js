import React from 'react';
import charData from './charData';


export function computeBgColorClassName(freqRank) {
    if (freqRank <= 100) {
        return 'bg-primary';
    } else if (freqRank <= 200) {
        return 'bg-success';
    } else if (freqRank <= 500) {
        return 'bg-info';
    } else if (freqRank <= 1000) {
        return 'bg-warning';
    } else if (freqRank <= 5000) {
        return 'bg-danger';
    } else {
        return 'bg-muted';
    }
}

function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

const HANDLE_CHAR = /./g;

export function handleCharStrategy(contentBlock, callback) {
    findWithRegex(HANDLE_CHAR, contentBlock, callback);
}

export const HandleChar = (props) => {
    return (
            <span className={computeBgColorClassName(charData.getFreqRank(props.decoratedText))}>
            {props.children}
        </span>
    );
};
