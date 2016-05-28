var React = require('react')

module.exports = class Promo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageIndex: 0
    }
  }
  componentDidMount () {
    setInterval(() => {
      // cycle through props.images every 3300 ms... CSS in _decibel.scss "transition: all 3000ms" causes the cross-fade
      if (this.state.imageIndex < this.props.images.length - 1) {
        this.setState({imageIndex: ++this.state.imageIndex})
      } else {
        this.setState({imageIndex: 0})
      }
    }, 3300)
  }
  render () {
    var images = this.props.images
    return <section id='promo' className='promo-section section'>
      <div className='slides'>
        <div className='slide' style={{'backgroundImage': `url(${images[this.state.imageIndex]})`}} />
      </div>
      <div className='container text-center promo-content'>
        <div className='upper-wrapper'>
          <h2 className='headline'>{this.props.headline}</h2>
          <div className='tagline'>{this.props.tagline}</div>
        </div>
      </div>
    </section>
  }
}
