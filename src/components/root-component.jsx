const React = require('react')
const {NavItem} = require('react-bootstrap')
const {Header, Footer} = require('./decibel')

const RootComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    content: React.PropTypes.element
  },
  render () {
    const content = this.props.content
    const navRight = this.props.user
      ? <NavItem key='/logout' href='/logout'>Logout</NavItem>
      : <NavItem key='/login' href='/login'>Login</NavItem>
    return <div className='root-component-container'>
      <Header>
        <NavItem key='/#promo' href='/#promo'><h3>Willie & Allie</h3></NavItem>
        <NavItem key='/#gigs' href='/#gigs'>Gigs</NavItem>
        <NavItem key='/#music' href='/#music'>Music</NavItem>
        <NavItem key='/#video' href='/#video'>Video</NavItem>
        <NavItem key='/#contact' href='/#contact'>Contact</NavItem>
        {navRight}
      </Header>
      {content}
      <Footer>
        <div className='copyright'>Willie & Allie © 2016</div>
      </Footer>
    </div>
  }
})

module.exports = RootComponent
