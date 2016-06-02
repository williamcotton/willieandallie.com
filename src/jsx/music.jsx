var React = require('react')

module.exports = class Music extends React.Component {
  render () {
    return <section id='music' className='music-section section text-center'>
      <div className='container'>
        <h2 className='section-title'>Music</h2>
        <div className='albums-block'>
          <h3 className='album-title'>
              Between a Rock and a Country Place - EP
          </h3>
          <div classNae='cover-holder'>
            <a className='cover-figure' href='#'>
              <div className='arrow-holder'></div>
              <div className='record-holder'><img className='img-responsive' src='/images/record.png' alt='' /></div>
              <img className='cover-image img-responsive' src='/images/temp-album.jpg' alt='' />
              <div className='cover-label'>Coming Soon</div>
            </a>
            <br />
            <a href='#' className='btn btn-sm btn-ghost-secondary'>Pre-Order Album</a>
          </div>
        </div>
        <div className='music-action'>
          <a className='btn btn-ghost-primary' href='#'>Music on bandcamp</a>
        </div>
      </div>
    </section>
  }
}
