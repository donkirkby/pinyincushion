import React from 'react';
import punycode from 'punycode';

// import logo from './logo.svg';

import charData from './charData';

import './PinyinCushionEditor.css';


const DisplayBox = React.createClass({
    computeBgColorClassName: function(freqRank) {
        if (freqRank <= 100) {
            return 'bg-primary';
        } else if (freqRank <= 200) {
            return 'bg-success';
        } else if (freqRank <= 500) {
            return 'bg-info';
        } else if (freqRank <= 2000) {
            return 'bg-warning';
        } else if (freqRank <= 5000) {
            return 'bg-danger';
        } else {
            return 'bg-muted';
        }
    },


    generateRubyHtml: function() {
        // console.log('children:', this.props.children);
        // console.log('text:', this.props.text);

        let html = '';
        for (let char of this.props.text) {
            let pinyin = charData.getPinyin(char);
            let freqRank = charData.getFreqRank(char);
            let bgColorClassName = this.computeBgColorClassName(freqRank);

            // TODO: replace this with DOM or proper escaping.
            html += '<ruby class="' + bgColorClassName + '">'
                + char
                + '<rp>(</rp><rt class="text-success">'
                + pinyin.toLowerCase()
                + '</rt><rp>)</rp></ruby>';
        }
        return { __html: html};
    },

    render: function() {
        // TODO: replace this with DOM or proper escaping.
        return (
                <div className="display-box">
                <h3>Display</h3>
                <div
            id="display"
            dangerouslySetInnerHTML={this.generateRubyHtml()}
                />
                </div>
        );
    }
});


const FeedbackBox = React.createClass({
    computeNumberOfCharacters: function() {
        // http://speakingjs.com/es5/ch24.html
        return punycode.ucs2.decode(this.props.text).length;
    },

    render: function() {
        return (
                <div className="feedback-box">
                <h3>Feedback</h3>
                <CharacterFrequencyList text={this.props.text} />
                <div>Entered {this.computeNumberOfCharacters()} Characters.</div>
                </div>
        );
    }
});


const CharacterFrequency = React.createClass({
    render: function() {
        return (
                <div className="character-frequency col-md-1">
                <span className="text-primary">{this.props.character}</span>:&nbsp;
                <span className="text-success">{this.props.frequency}</span>
                </div>
        );
    }
});


const CharacterFrequencyList = React.createClass({
    computeCharacterFrequency: function() {
        let counts = {};
        for (let char of this.props.text) {
            counts[char] = counts[char] ? counts[char]+1 : 1;
        }
        return counts;
    },

    render: function() {
        let counts = this.computeCharacterFrequency();
        let charFreqList = Object.keys(counts).map(
            x => ({char: x, count: counts[x]})
        );

        // reversed order
        let charFreqListSorted = charFreqList.sort((a, b) => b.count - a.count);

        let charFreqListNode = charFreqListSorted.map(item => (
                <CharacterFrequency key={item.char} character={item.char} frequency={item.count} />
        ));

        return (
                <div className="character-frequency-list">
                {charFreqListNode}
            </div>
        );
    }
});


const InputBox = React.createClass({
    render: function() {
        return (
                <div className="input-box">
                <h3>Input</h3>
                <textarea
            className="form-control"
            onChange={this.props.handleChange}
            placeholder="Type Chinese here to get instant feedback" />
                </div>
        );
    }
});


const PinyinCushionEditor = React.createClass({
    getInitialState: function() {
        return {
            value: '你好'
        };
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
    },

    render: function() {
        return (
                <div className="pinyin-cushion-editor">
                <div className="left-container col-md-4">
                <InputBox handleChange={this.handleChange} />
                </div>

                <div className="right-container col-md-8">
                <DisplayBox text={this.state.value} />
                <FeedbackBox text={this.state.value} />
                </div>
                </div>
        );
    }
});


export default PinyinCushionEditor;
