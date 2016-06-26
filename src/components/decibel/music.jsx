var React = require('react')

module.exports = class Music extends React.Component {
  render () {
    var album = this.props.album
    return <section id='music' className='music-section section text-center'>
      <div className='container'>
        <h2 className='section-title'>Music</h2>
        <div className='albums-block'>
          <h3 className='album-title'>
              {album.title}
          </h3>
          <div classNae='cover-holder'>
            <a className='cover-figure' href={album.linkUrl}>
              <div className='record-holder'><img className='img-responsive' src='/images/record.png' alt='' /></div>
              <img className='cover-image img-responsive' src={album.coverArtUrl} alt='' />
            </a>
            <br />
            {album.preOrder ? <a href='#' className='btn btn-sm btn-ghost-secondary'>Pre-Order Album</a> : false}
          </div>
        </div>
        {this.props.bandcampUrl ? <div className='music-action'><a className='btn btn-ghost-primary' href={this.props.bandcampUrl} >Music on bandcamp</a></div> : false}
      </div>
    </section>
  }
}
