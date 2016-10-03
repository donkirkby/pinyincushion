import React from 'react';

// import logo from './logo.svg';

import charData from './charData';


class FreqRankLegend extends React.Component {
    render() {
        return (
                <div className="freq-rank-legend col-md-offset-4 hidden-print">
                Top: &nbsp;
                <span className="bg-primary">100</span>
                <span className="bg-success">200</span>
                <span className="bg-info">500</span>
                <span className="bg-warning">1000</span>
                <span className="bg-danger">10000</span>
                </div>
        );
    }

}


const DisplayBox = React.createClass({
    computeBgColorClassName: function(freqRank) {
        if (freqRank <= 100) {
            return 'bg-primary';
        } else if (freqRank <= 200) {
            return 'bg-success';
        } else if (freqRank <= 500) {
            return 'bg-info';
        } else if (freqRank <= 1000) {
            return 'bg-warning';
        } else if (freqRank <= 10000) {
            return 'bg-danger';
        } else {
            return 'bg-muted';
        }
    },


    generateRubyHtml: function() {
        // console.log('children:', this.props.children);
        // console.log('text:', this.props.text);

        let html = '';
        let chars = charData.splitChars(this.props.text);
        for (let char of chars) {
            let freqRank = charData.getFreqRank(char.c);
            let bgColorClassName = this.computeBgColorClassName(freqRank);

            if (char.c === ' ') {
                html += '&nbsp;';
            } else if (char.c === '\n') {
                html += '<br>';
            } else {
                // TODO: replace this with DOM or proper escaping.
                html += '<ruby class="' + bgColorClassName + '">'
                    + char.c
                    + '<rp>(</rp><rt class="text-success">'
                    + char.p.toLowerCase()
                    + '</rt><rp>)</rp></ruby>';
            }
        }
        return { __html: html};
    },

    render: function() {
        // TODO: replace this with DOM or proper escaping.
        return (
                <div className="display-box">
                <h3 className="display-header hidden-print">Display</h3>
                <div className="display"
                     dangerouslySetInnerHTML={this.generateRubyHtml()}
                />
                <FreqRankLegend />
                </div>
        );
    }
});


const InputBox = React.createClass({
    render: function() {
        return (
                <div className="input-box">
                <h3>Input{this.props.willSave ? '*' : ''}</h3>
                <textarea
                    className="form-control"
                    onChange={this.props.handleChange}
                    placeholder="Type Chinese here to get instant feedback"
                    value={this.props.text} />
                </div>
        );
    }
});


const PinyinCushionEditor = React.createClass({
    getInitialState: function() {
        var canSave = this.localStorageAvailable(),
            text = canSave ? window.localStorage.text : '你好';
        return {
            value: text,
            canSave: canSave,
            willSave: false
        };
    },
    
    localStorageAvailable: function() {
        try {
            var storage = window.localStorage,
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
        if ( this.state.canSave && ! this.state.willSave) {
            window.setTimeout(this.saveBackup, 10000);
            this.setState({willSave: true});
        }
    },
    
    saveBackup: function() {
        window.localStorage.text = this.state.value;
        this.setState({willSave: false});
    },

    render: function() {
        return (
                <div className="pinyin-cushion-editor">
                <div className="left-container col-md-4 hidden-print">
                <InputBox
                    handleChange={this.handleChange}
                    text={this.state.value}
                    willSave={this.state.willSave}/>
                </div>

                <div className="right-container col-md-8">
                <DisplayBox text={this.state.value} />
                </div>
                </div>
        );
    }
});


export default PinyinCushionEditor;
