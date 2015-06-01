var React = require('react');
var Song = require('./song.jsx');
var Player = require('./player.jsx');
var YouTube = require('react-youtube');
var songs = [
  { title: "Go On And Get Crucified", lyrics:"", type:'mp3', src:'https://s3-us-west-1.amazonaws.com/willieandallie/Crucifed.mp3'},
  { title: "Write Me A Letter", lyrics:"", type:'mp3', src:'https://s3-us-west-1.amazonaws.com/willieandallie/Write+Me+A+Letter.mp3'},
  { title: "The Day The Old Man Was Dead", lyrics:"", type:'mp3', src:'https://s3-us-west-1.amazonaws.com/willieandallie/The+Day+The+Old+Man+Was+Dead.mp3'}
];
var shows = [
 { location: "Noe Valley Farmer's Market", date:"July 25th @ 11:00am"},
]
var youtube = { title: "Crazy As A Loon (John Prine)", lyrics:"", type:'youtube', src:'http://www.youtube.com/watch?v=73lpAL6gvfY' };
var FrontPage = React.createClass({
  getInitialState: function() {
    return {
      selectedSong: false,
      autoPlay: false
    };
  },
  selectSong: function(song) {
    this.selectedSong = song;
  },
  render: function() {

    var component = this;

    var sketch = <div><img id="sketch" src="https://s3-us-west-1.amazonaws.com/willieandallie/willieandallie.jpg" /><p id="credit">Illustration by <a href="https://www.flickr.com/photos/lauriewigham">Laurie Wigham</a></p></div>;

    var onYouTubeReady = function(event) {
      var youTubePlayer = event.target;
      ccc = youTubePlayer;
      component.setState({
        youTubePlayer: youTubePlayer
      })
      youTubePlayer.playVideo();
    }
    var youtubeElement = <YouTube id="crazy-as-a-loon-video" ref="player" url={youtube.src} onReady={onYouTubeReady}/>;
    var toggleYouTube = function(play) {
      component.setState({selectedSong: youtube});
      if (component.state.youTubePlayer) {
        play ? component.state.youTubePlayer.playVideo() : component.state.youTubePlayer.pauseVideo();
      }
    };

    var createImage = function(song) {
      return song.type == "youtube" ? youtubeElement : sketch;
    };

    var onSongSelect = function(song) {

      component.setState({selectedSong: song});
    };

    var createSong = function(song) {
      return <Song key={song.title} song={song} onSelect={onSongSelect}/>;
    };

    var createShow = function(show) {
      return (
        <li key={show.date}>
          <span className="date">{show.date}</span>
          <span className="location">{show.location}</span>
        </li>
      )
    }

    console.log(component.state.youTubePlayer);

    if (component.state.youTubePlayer) {
      console.log(component.state.youTubePlayer.getPlayerState());
    }

    var youTubePlaying = component.state.youTubePlayer ? (component.state.youTubePlayer.getPlayerState() == 2) || (component.state.youTubePlayer.getPlayerState() == 5) : false;

    var mainImage = createImage(this.state.selectedSong);
    var content = this.props.content;
    return (
      <div className="front-page">
        <div id="main-image">
          { mainImage }
        </div>
        <div id="main-content">
          <h1>Willie &amp; Allie</h1>
          <h1 className="cal-country">California Country</h1>
          <div id="songs">
            <h2>Music</h2>
            {songs.map(createSong)}
            <Player title={youtube.title} toggle={toggleYouTube} playing={youTubePlaying}/>
          </div>
          <ol className="shows">
            <h2>Shows</h2>
            {shows.map(createShow)}
          </ol>
          <div className="contact">
            <h2>Contact</h2>
            <span className="email">willieandallie@gmail.com</span>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = FrontPage;