var React = require('react')

module.exports = class Promo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageIndex: 0
    }
  }
  componentDidMount () {
    // we're breaking out of React and modifying the DOM directly to have finer control over the animation
    var slides = this.refs.slides

    setInterval(() => {
      // cycle through props.images every 6000 ms... _promo-section.scss: "transition: all 3000ms" causes the cross-fade
      if (this.state.imageIndex < this.props.images.length - 1) {
        this.setState({imageIndex: ++this.state.imageIndex})
      } else {
        this.setState({imageIndex: 0})
      }

      // every cycle we need to add the 'enter' class to start the transition from scale(2)/opacity(0)
      let enterSlide = slides.children[slides.children.length - 1]
      enterSlide.classList.add('enter')

      // we then quickly remove the 'enter' class so it transitions over 3000ms to scale(1)/opacity(1)
      setTimeout(() => enterSlide.classList.remove('enter'), 200)
    }, 6000)
  }
  render () {
    var images = this.props.images
    var sortedImages = images.slice(this.state.imageIndex, images.length).concat(images.slice(0, this.state.imageIndex))
    var slides = sortedImages.map((imgUrl, i) => {
      return <div key={imgUrl} className='slide' style={{'backgroundImage': `url(${imgUrl})`}} />
    })
    var imgUrl = images[this.state.imageIndex]
    return <section id='promo' className='promo-section section'>
      <div className='screen'></div>
      <div className='slides' ref='slides'>
        {slides}
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
