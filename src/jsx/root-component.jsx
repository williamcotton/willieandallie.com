const React = require('react')
const {NavItem} = require('react-bootstrap')

var RootComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    content: React.PropTypes.element
  },
  getInitialState () {
    return {
      didScroll: false
    }
  },
  render () {
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
          var scrollTop = event.target.documentElement.scrollTop || event.target.body.scrollTop
          if (!this.state.didScroll && scrollTop > 0) {
            this.setState({didScroll: true})
          }
          if (this.state.didScroll && scrollTop === 0) {
            this.setState({didScroll: false})
          }
        }
        window.addEventListener('scroll', onscroll)
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (!this.state.didScroll && scrollTop > 0) {
          this.setState({didScroll: true})
        }
      }}>
        <div className='container '>
          <nav className='main-nav' role='navigation'>
            <div id='navbar-collapse' className='navbar-collapse collapse text-center'>
              <ul className='nav navbar-nav center-block'>
                <NavItem key='/#promo' href='/#promo'><h3>Willie & Allie</h3></NavItem>
                <NavItem key='/#gigs' href='/#gigs'>Gigs</NavItem>
                <NavItem key='/#music' href='/#music'>Music</NavItem>
                <NavItem key='/#video' href='/#video'>Video</NavItem>
                <NavItem key='/#contact' href='/#contact'>Contact</NavItem>
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
