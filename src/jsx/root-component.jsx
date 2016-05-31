const React = require('react')
const {NavItem} = require('react-bootstrap')

var RootComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    content: React.PropTypes.element
  },
  getInitialState: () => {
    return {
      didScroll: false
    }
  },
  render: function () {
    var content = this.props.content
    const navRight = this.props.user ? [
      <NavItem key='/logout' href='/logout'>Logout</NavItem>
    ] : [
      <NavItem key='/login' href='/login'>Login</NavItem>
    ]
    var headerClass = 'header navbar-fixed-top' + (this.state.didScroll ? ' didScroll' : '')
    return <div className='root-component-container'>
      <header id='header' className={headerClass} ref={(e) => {
        let onscroll = (event) => {
          if (!this.state.didScroll && event.target.body.scrollTop > 0) {
            this.setState({didScroll: true})
          }
          if (this.state.didScroll && event.target.body.scrollTop === 0) {
            this.setState({didScroll: false})
          }
        }
        window.addEventListener('scroll', onscroll)
        if (!this.state.didScroll && document.body.scrollTop > 0) {
          this.setState({didScroll: true})
        }
      }}>
        <div className='container '>
          <nav className='main-nav' role='navigation'>
            <div id='navbar-collapse' className='navbar-collapse collapse text-center'>
              <ul className='nav navbar-nav center-block'>
                <li className='nav-item'><h3><a className='scrollto' href='/#promo'>Willie & Allie</a></h3></li>
                <li className='nav-item'><a className='scrollto' href='/#gigs'>Gigs</a></li>
                <li className='nav-item'><a className='scrollto' href='/#music'>Music</a></li>
                <li className='nav-item'><a className='scrollto' href='/#video'>Video</a></li>
                <li className='nav-item'><a className='scrollto' href='/#contact'>Contact</a></li>
                {navRight}
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
