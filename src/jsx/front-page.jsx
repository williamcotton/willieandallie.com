var React = require('react')
var Song = require('./song.jsx')
var Player = require('./player.jsx')
var YouTube = require('react-youtube')
var songs = [
  { title: 'Go On And Get Crucified', lyrics: '', type: 'mp3', src: 'https://s3-us-west-1.amazonaws.com/willieandallie/Crucifed.mp3' },
  { title: 'Write Me A Letter', lyrics: '', type: 'mp3', src: 'https://s3-us-west-1.amazonaws.com/willieandallie/Write+Me+A+Letter.mp3' },
  { title: 'The Day The Old Man Was Dead', lyrics: '', type: 'mp3', src: 'https://s3-us-west-1.amazonaws.com/willieandallie/The+Day+The+Old+Man+Was+Dead.mp3' }
]

var videos = [
  { title: 'Asphalt and White Lines', lyrics: '', type: 'youtube', src: 'http://www.youtube.com/watch?v=ceyb8_qQYlI&rel=0' },
  { title: 'Riot on a Screen', lyrics: '', type: 'youtube', src: 'https://www.youtube.com/watch?v=3-fLrqHUNMI&rel=0' },
  { title: 'Tobacco Fields', lyrics: '', type: 'youtube', src: 'https://www.youtube.com/watch?v=3sNM8KnTE80&rel=0' },
  { title: 'Take Me Away', lyrics: '', type: 'youtube', src: 'https://www.youtube.com/watch?v=PmpfR18PoCE&rel=0' },
  { title: 'Crazy As A Loon (John Prine)', lyrics: '', type: 'youtube', src: 'http://www.youtube.com/watch?v=73lpAL6gvfY&rel=0' }

]
var FrontPage = React.createClass({
  getInitialState: function () {
    return {
      selectedSong: false,
      autoPlay: false
    }
  },
  selectSong: function (song) {
    this.selectedSong = song
  },
  render: function () {
    var shows = this.props.shows

    var component = this

    var sketch = <div><img id='sketch' src='https://s3-us-west-1.amazonaws.com/willieandallie/willieandallie.jpg' /><p id='credit'>Illustration by <a href='https://www.flickr.com/photos/lauriewigham'>Laurie Wigham</a></p></div>

    var createVideo = function (video) {
      var onYouTubeReady = function (event) {
        var youTubePlayer = event.target
        video.youTubePlayer = youTubePlayer
        youTubePlayer.playVideo()
      }
      var youTubeElement = <YouTube id='crazy-as-a-loon-video' ref='player' url={video.src} onReady={onYouTubeReady}/>
      video.youTubeElement = youTubeElement
      var toggleYouTube = function (play) {
        component.setState({selectedSong: video})
        if (video.youTubePlayer) {
          play ? video.youTubePlayer.playVideo() : video.youTubePlayer.pauseVideo()
        }
      }
      var youTubePlaying = video.youTubePlayer ? (video.youTubePlayer.getPlayerState() === 2) || (video.youTubePlayer.getPlayerState() === 5) : false
      return <Player title={video.title} toggle={toggleYouTube} playing={youTubePlaying}/>
    }

    var onSongSelect = function (song) {
      component.setState({selectedSong: song})
    }

    var createSong = function (song) {
      return <Song key={song.title} song={song} onSelect={onSongSelect}/>
    }

    var createShow = function (show) {
      return (
      <li key={show.date}>
          <span className='location'><a href={show.link}>{show.place}</a></span>
          <span className='date-time'>
            <span className='date'>{show.date}</span>, <span className='time'>{show.time}</span>
          </span>
        </li>
      )
    }

    var showsContainer = shows.length
      ? <ol className='shows'><h2>Shows</h2>{shows.map(createShow)}</ol>
      : <div id='songs'>We're recording! Look out for shows in the spring!</div>

    var mainImage = this.state.selectedSong.youTubeElement || sketch
    var content = this.props.content
    return (
    <div className='front-page'>
        <div id='main-image'>
          { mainImage }
        </div>
        <div id='main-content'>
          <h1>Willie &amp; Allie</h1>
          <h1 className='cal-country'>California Country</h1>
          <div id='songs'>
            <h2>Video</h2>
            {videos.map(createVideo)}
          </div>
          <div id='songs'>
            <h2>Music</h2>
            {songs.map(createSong)}
          </div>
          {showsContainer}
          <div className='contact'>
            <h2>Contact</h2>
            <span className='email'>willieandallie@gmail.com</span>
          </div>
        </div>
      </div>
    )
  }
})
module.exports = FrontPage
