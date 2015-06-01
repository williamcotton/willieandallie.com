var React = require('react');
var Player = require('./player.jsx');
var Song = React.createClass({
  getInitialState: function() {
    return {
      playing: false 
    };
  },
  render: function() {
    var component = this;
    var song = this.props.song;
    var songClick = function(play) {
      var playerElement = component.refs.player.getDOMNode();
      play ? playerElement.play() : playerElement.pause();
      component.props.onSelect(song);
    };
    return (
      <div className="song" >
        <Player title={song.title} toggle={songClick} />
        <div className="media"><audio ref="player" src={song.src} ></audio></div>
      </div>
    );
  }

});

module.exports = Song;