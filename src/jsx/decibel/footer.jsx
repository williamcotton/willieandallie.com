const React = require('react')

module.exports = class Footer extends React.Component {
  render () {
    return <footer className='footer'>
      <div className='container'>
        <div className='footer-content text-center'>
          {this.props.children}
        </div>
      </div>
    </footer>
  }
}
