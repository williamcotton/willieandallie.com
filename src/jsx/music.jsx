var React = require('react')

module.exports = class Music extends React.Component {
  render () {
    return <section id='music' className='music-section section text-center'>
      <div className='container'>
        <h2 className='section-title'>Music</h2>
        <div className='music-action'>
          <a className='btn btn-ghost-primary' href='#'>Music on bandcamp</a>
        </div>
      </div>
    </section>
  }
}
