import React from 'react';
import './PinyinCushionEditor.css';
// import logo from './logo.svg';

import pronunciation from './pronunciation';


const DisplayBox = React.createClass({
  generateRubyHtml: function() {
    // console.log('children:', this.props.children);
    // console.log('text:', this.props.text);
    
    var html = '';
    for (var i = 0; i < this.props.text.length; i++) {
      var char = this.props.text.charAt(i);
      var pinyin = pronunciation.getPinyin(char);
      // TODO: replace this with DOM or proper escaping.
      html += '<ruby class="text-primary">' + char + '<rt class="text-success">' +  pinyin + '</rt></ruby>';
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


var FeedbackBox = React.createClass({
  computeNumberOfCharacters: function() {
    return this.props.text.length;
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

var CharacterFrequency = React.createClass({
  render: function() {
    return (
      <div className="character-frequency col-md-1">
        <span className="text-primary">{this.props.character}</span>:&nbsp;
        <span className="text-success">{this.props.frequency}</span>
      </div>
    );
  }
});

var CharacterFrequencyList = React.createClass({
  computeCharacterFrequency: function() {
    var counts = {};
    for (var i = 0; i < this.props.text.length; i++) {
      var char = this.props.text.charAt(i);
      counts[char] = counts[char] ? counts[char]+1 : 1;
    }
    return counts;
  },
  
  render: function() {
    var counts = this.computeCharacterFrequency();
    var charFreqList = Object.keys(counts).map(
      x => ({char: x, count: counts[x]})
    );

    // reversed order
    var charFreqListSorted = charFreqList.sort((a, b) => b.count - a.count);

    var charFreqListNode = charFreqListSorted.map(item => (
        <CharacterFrequency key={item.char} character={item.char} frequency={item.count} />
    ));
    
    return (
      <div className="character-frequency-list">
        {charFreqListNode}
      </div>
    );
  }
});


var InputBox = React.createClass({
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


var PinyinCushionEditor = React.createClass({
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
