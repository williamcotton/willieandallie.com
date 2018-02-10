var React = require('react')

module.exports = class Video extends React.Component {
  render () {
    return <section id='video' className='video-section section text-center'>
      <a name='video' />
      <div className='container'>
        <h2 className='section-title'>Video</h2>
        <iframe src={this.props.videoSrc1} frameBorder='0' allowFullScreen></iframe>
        <iframe src={this.props.videoSrc2} frameBorder='0' allowFullScreen></iframe>
        {this.props.youtubeUrl ? <div className='video-action'><a className='btn btn-ghost-primary' href={this.props.youtubeUrl}>More Videos on YouTube</a></div> : false}
      </div>
    </section>
  }
}
