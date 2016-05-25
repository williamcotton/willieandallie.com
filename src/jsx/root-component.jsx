var React = require('react')

var RootComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    content: React.PropTypes.element
  },
  render: function () {
    var content = this.props.content
    return <div className='root-component-container'>
      <header id='header' className='header navbar-fixed-top'>
        <div className='container '>
          <nav className='main-nav' role='navigation'>
            <div id='navbar-collapse' className='navbar-collapse collapse text-center'>
              <ul className='nav navbar-nav center-block'>
                <li className='nav-item'><a className='scrollto' href='#promo'>Home</a></li>
                <li className='nav-item'><a className='scrollto' href='#gigs'>Gigs</a></li>
                <li className='nav-item'><a className='scrollto' href='#music'>Music</a></li>
                <li className='nav-item'><a className='scrollto' href='#video'>Video</a></li>
                <li className='nav-item'><a className='scrollto' href='#contact'>Contact</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
      {content}
      <footer className='footer'>
        <div className='container'>
          <div className='footer-content text-center'>
            <div className='copyright'>Willie & Allie © 2016</div>
          </div>
        </div>
      </footer>
    </div>
  }
})

module.exports = RootComponent
