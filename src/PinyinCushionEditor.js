import React from 'react';
import {Editor, EditorState, ContentState, CompositeDecorator} from 'draft-js';

import charData from './charData';
import {handleCharStrategy, HandleChar} from './draftDecorators';


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
    render: function() {
        var key = 0,
            chars = charData.splitChars(this.props.text);
        return (
                <div className="display-box">
                    <h3 className="display-header hidden-print">Display</h3>
                    <div className="display">
                        {chars.map(function(char) {
                            key += 1;
                            
                            if (char.c === ' ') {
                                return <span key={key}>&nbsp;</span>;
                            }
                            if (char.c === '\n') {
                                return <br key={key}/>;
                            }
                            return <ruby key={key}>
                                    <rb>{char.c}</rb>
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

        const compositeDecorator = new CompositeDecorator([
            {
                strategy: handleCharStrategy,
                component: HandleChar
            },
        ]);

        var editorState;
        if (text === undefined) {
            text = "";
        }
        var contentState = ContentState.createFromText(text),
            editorState = EditorState.createWithContent(
                contentState,
                compositeDecorator);

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
        var content = editorState.getCurrentContent();
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
                                placeholder='Type some Chinese. 写点中文...' />
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
