import React from 'react';
import {Editor, EditorState, ContentState, RichUtils, CompositeDecorator} from 'draft-js';

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
                <span className="bg-danger">5000</span>
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
        } else if (freqRank <= 5000) {
            return 'bg-danger';
        } else {
            return 'bg-muted';
        }
    },


    render: function() {
        var displayBox = this,
            key = 0,
            chars = charData.splitChars(this.props.text);
        return (
                <div className="display-box">
                    <h3 className="display-header hidden-print">Display</h3>
                    <div className="display">
                        {chars.map(function(char) {
                            var freqRank = charData.getFreqRank(char.c),
                                bgColorClassName = displayBox.computeBgColorClassName(
                                        freqRank);
                            key += 1;
                            
                            if (char.c === ' ') {
                                return <span key={key}>&nbsp;</span>;
                            }
                            if (char.c === '\n') {
                                return <br key={key}/>;
                            }
                            return <ruby key={key} className={bgColorClassName}>
                                    {char.c}
                                    <rp>(</rp>
                                    <rt className="text-success">{char.p}</rt>
                                    <rp>)</rp>
                                </ruby>;
                        })}
                    </div>
                    <FreqRankLegend />
                </div>
        );
    }
});


const PinyinCushionEditor = React.createClass({
    getInitialState: function() {
        var canSave = this.localStorageAvailable(),
            text = canSave ? window.localStorage.text : undefined;
        if (text === undefined) {
            text = '你好';
        }

        var editorState;
        if (text !== undefined) {
            var contentState = ContentState.createFromText(text);
            editorState = EditorState.createWithContent(contentState);
        } else {
            editorState = EditorState.createEmpty();
        }

        return {
            value: text,
            canSave: canSave,
            willSave: false,

            editorState: editorState
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

    onChange: function(editorState) {
        this.setState({editorState: editorState});
        var content = this.state.editorState.getCurrentContent();
        var text = content.getPlainText();

        this.setState({value: text});

        if ( this.state.canSave && ! this.state.willSave) {
            window.setTimeout(this.saveBackup, 1000);
            this.setState({willSave: true});
        }
    },

    focus: function() {
        this.refs.editor.focus();
    },
    
    saveBackup: function() {
        window.localStorage.text = this.state.value;
        this.setState({willSave: false});
    },

    render: function() {
        var {editorState, willSave, value} = this.state;

        return (
            <div className="pinyin-cushion-editor">
                <div className="left-container col-md-4 hidden-print">
                    <h3>Input{willSave ? '*' : ''}</h3>
                    <div className="input-box" onClick={this.focus}>
                        <Editor editorState={editorState}
                                onChange={this.onChange}
                                ref='editor'
                                placeholder='abc' />
                    </div>
                </div>

                <div className="right-container col-md-8">
                    <DisplayBox text={value} />
                </div>
            </div>
        );
    }
});


export default PinyinCushionEditor;
