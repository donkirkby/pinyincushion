import React from 'react';
import charData from './charData';


function findWithRegex(regex, boundary, contentBlock, callback) {
    const text = contentBlock.getText();
    let start;
    let matchArr = regex.exec(text);
    while (matchArr !== null) {
        start = matchArr.index;
        if (charData.isRankAbove(matchArr[0], boundary)) {
            callback(start, start + matchArr[0].length);
        }
        matchArr = regex.exec(text);
    }
}

const HANDLE_CHAR = /./g;

export function createHandleCharStrategy(boundary) {
    function handleCharStrategy(contentBlock, callback) {
        findWithRegex(HANDLE_CHAR, boundary, contentBlock, callback);
    }
    return handleCharStrategy;
}

export class HandleChar extends React.Component {
    render () {
        return (
            <span className="bg-danger">
                {this.props.children}
            </span>
        );
    }
}
