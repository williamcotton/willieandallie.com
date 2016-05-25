var React = require('react')

module.exports = class Video extends React.Component {
  render () {
    return <section id='video' className='music-section section text-center'>
        <div className='container'>
            <h2 className='section-title'>Video</h2>
            <div className='video-action'>
                <a className='btn btn-ghost-primary' href='https://www.youtube.com/user/PuffaloPhil'>Video on YouTube</a>
            </div>
        </div>
    </section>
  }
}
