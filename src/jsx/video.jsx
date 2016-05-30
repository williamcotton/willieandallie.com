var React = require('react')

module.exports = class Video extends React.Component {
  render () {
    return <section id='video' className='video-section section text-center'>
      <div className='container'>
        <h2 className='section-title'>Video</h2>
        <div className='video-action'>
          <div className='section'>
            <iframe src='https://www.youtube.com/embed/QzsN7wvu0Lo?rel=0&amp;controls=0&amp;showinfo=0' frameBorder='0' allowFullScreen></iframe>
          </div>
          <a className='btn btn-ghost-primary' href='https://www.youtube.com/user/PuffaloPhil'>More Videos on YouTube</a>
        </div>
      </div>
    </section>
  }
}
