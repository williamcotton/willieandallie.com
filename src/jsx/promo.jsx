var React = require('react')

module.exports = class Promo extends React.Component {
  render () {
    return <section id='promo' className='promo-section section'>
      <div className='container text-center promo-content'>
        <div className='upper-wrapper'>
          <h1 className='logo-holder'></h1>
          <h2 className='headline'>{this.props.headline}</h2>
          <div className='tagline'>{this.props.tagline}</div>
        </div>
      </div>
    </section>
  }
}
