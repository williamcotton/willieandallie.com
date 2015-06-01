var React = require('react');
var Player = React.createClass({
  getInitialState: function() {
    return {
      playing: false 
    };
  },
  toggle: function() {
    console.log("toggle");
    var component = this;
    component.setState({
      playing: !component.state.playing
    });
    this.props.toggle(!component.state.playing);
  },
  render: function() {
    var component = this;
    var title = this.props.title;
    var playing = typeof(this.props.playing) == "undefined" ? this.state.playing : this.props.playing;
    var pauseButton = "❚❚";
    var playButton = "►";
    var button = <button className="toggle">{playing ? "❚❚" : "►"}</button>
    return (
      <div className="song" onClick={this.toggle} onTouchStart={this.toggle} >
        <h3>{button}{title}</h3>
      </div>
    );
  }

});

module.exports = Player;