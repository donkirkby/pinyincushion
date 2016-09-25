// client-side js
// run by the browser each time your view template is loaded

"use strict";


const DisplayBox = React.createClass({
  generateRubyHtml: function() {
    // console.log('children:', this.props.children);
    // console.log('text:', this.props.text);
    
    var html = ''
    for (var i = 0; i < this.props.text.length; i++) {
      var char = this.props.text.charAt(i);
      var pinyin = pronunciation.getPinyin(char);
      html += '<ruby>' + char + '<rt>' +  pinyin + '</rt>' + '</ruby>';
    }
    return { __html: html};
  },
  
  render: function() {
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
        Entered {this.computeNumberOfCharacters()} Characters.
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
        <div className="left-container col-md-6">
          <InputBox handleChange={this.handleChange} />
        </div>
        
        <div className="right-container col-md-6">
          <DisplayBox text={this.state.value} />
          <FeedbackBox text={this.state.value} />
        </div>
      </div>
    );
  }
});



ReactDOM.render(<PinyinCushionEditor />, document.getElementById('pinyin-cushion-app'));