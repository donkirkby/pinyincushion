import React from 'react';
import {Editor, EditorState, ContentState, CompositeDecorator} from 'draft-js';

import charData from './charData';
import {createHandleCharStrategy, HandleChar} from './draftDecorators';


class FreqRankLegend extends React.Component {
    constructor(props) {
        super(props);

        this.handleBoundaryChange = this.handleBoundaryChange.bind(this);
    }

    handleBoundaryChange(event) {
        this.props.onBoundaryChange(event.target.value);
    }

    render() {
        var levels = [];
        for (const boundary of charData.getRankBoundaries()) {
            levels.push(<option value={boundary} key={boundary}>{boundary}</option>)
        }
        return (
            <div className="freq-rank-legend col-md-offset-4 hidden-print">
                Top:
                <select
                    value={this.props.boundary}
                    onChange={this.handleBoundaryChange}>
                    {levels}
                </select>
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
                    <h3 className="display-header hidden-print">Text Display</h3>
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
                    <FreqRankLegend
                        boundary={this.props.boundary}
                        onBoundaryChange={this.props.onBoundaryChange} />
                </div>
        );
    }
});


class PinyinCushionEditor extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.handleBoundaryChange = this.handleBoundaryChange.bind(this);
        this.saveBackup = this.saveBackup.bind(this);
        this.focus = this.focus.bind(this);

        var canSave = this.localStorageAvailable(),
            text = canSave ? window.localStorage.text : undefined,
            defaultBoundary = 1000;

        if (text === undefined) {
            text = "";
        }

        this.state = {
            canSave: canSave,
            willSave: false,
            boundary: defaultBoundary,
            editorState: this.createEditorState(text, defaultBoundary)
        };
    }

    localStorageAvailable() {
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
    }

    createEditorState(text, boundary) {
        const compositeDecorator = new CompositeDecorator([
            {
                strategy: createHandleCharStrategy(boundary),
                component: HandleChar
            },
        ]);
        var contentState = ContentState.createFromText(text),
            editorState = EditorState.createWithContent(
                contentState,
                compositeDecorator);
        return editorState;
    }

    onChange(editorState) {
        this.setState({editorState: editorState});

        if ( this.state.canSave && ! this.state.willSave) {
            window.setTimeout(this.saveBackup, 1000);
            this.setState({willSave: true});
        }
    }

    focus() {
        this.refs.editor.focus();
    }
    
    saveBackup() {
        var content = this.state.editorState.getCurrentContent();
        window.localStorage.text = content.getPlainText();
        this.setState({willSave: false});
    }

    handleBoundaryChange(boundary) {
        this.setState((prevState) => {
            var content = this.state.editorState.getCurrentContent(),
                text = content.getPlainText();
            return {
                editorState: this.createEditorState(text, boundary),
                boundary: boundary
            };
        });
    }

    render() {
        var {editorState, willSave} = this.state;
        var text = editorState.getCurrentContent().getPlainText();

        return (
            <div className="pinyin-cushion-editor">
                <div className="left-container col-md-4 hidden-print">
                    <h3>Input{willSave ? '*' : ''}</h3>
                    <div className="input-box" onClick={this.focus}>
                        <Editor editorState={editorState}
                                onChange={this.onChange}
                                ref='editor'
                                placeholder='Type some Chinese. 写点中文吧...' />
                    </div>
                </div>

                <div className="right-container col-md-8">
                    <DisplayBox
                        text={text}
                        boundary={this.state.boundary}
                        onBoundaryChange={this.handleBoundaryChange} />
                </div>
            </div>
        );
    }
}


export default PinyinCushionEditor;
