var React = require('react')

module.exports = class Contact extends React.Component {
  render () {
    return <div id='contact' className='contact-section section text-center'>
    <a name='contact' />
      <div className='container'>
        <h2 className='section-title'>Contact</h2>
        <div className='section-intro center-block'>{this.props.contactMessage}</div>
        <div className='contact-block center-block'>
          <div className='row'>
            <div className='item col-md-4 col-sm-12 col-xs-12'></div>
            <div className='item col-md-4 col-sm-12 col-xs-12'>
              <div className='item-inner'>
                <div className='icon-holder'>
                  <i className='fa fa-calendar-check-o'></i>
                </div>
                <h4 className='title'>Booking</h4>
                <div className='email'><a href={'mailto:' + this.props.bookingEmail + '?subject=Booking'}>{this.props.bookingEmail}</a></div>
              </div>
            </div>
            <div className='item col-md-4 col-sm-12 col-xs-12'></div>
          </div>
        </div>
        <div className='channels-block'>
          <ul className='channels-list list-inline'>
            {this.props.itunesUrl ? <li><a href={this.props.itunesUrl}><img className='icon' src='/images/itunes.svg' alt='' /></a></li> : false}
            {this.props.lastFmUrl ? <li><a href={this.props.lastFmUrl}><img className='icon' src='/images/lastfm.svg' alt='' /></a></li> : false}
            {this.props.vevoUrl ? <li><a href={this.props.vevoUrl}><img className='icon' src='/images/vevo.svg' alt='' /></a></li> : false}
            {this.props.bandcampUrl ? <li><a href={this.props.bandcampUrl}><img className='icon' src='/images/bandcamp.svg' alt='' /></a></li> : false}
          </ul>
        </div>
        <div className='social-media-block'>
          <ul className='list-inline social-media-list'>
            {this.props.facebookUrl ? <li><a href={this.props.facebookUrl}><i className='fa fa-facebook'></i></a></li> : false}
            {this.props.youtubeUrl ? <li><a href={this.props.youtubeUrl}><i className='fa fa-youtube'></i></a></li> : false}
            {this.props.soundcloudUrl ? <li><a href={this.props.soundcloudUrl}><i className='fa fa-soundcloud'></i></a></li> : false}
            {this.props.spotifyUrl ? <li><a href={this.props.spotifyUrl}><i className='fa fa-spotify'></i></a></li> : false}
            {this.props.instagramUrl ? <li><a href={this.props.instagramUrl}><i className='fa fa-instagram'></i></a></li> : false}
            {this.props.twitterUrl ? <li><a href={this.props.twitterUrl}><i className='fa fa-twitter'></i></a></li> : false}
          </ul>
        </div>
      </div>
    </div>
  }
}
