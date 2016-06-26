const React = require('react')

const Header = React.createClass({
  getInitialState () {
    return {
      didScroll: false
    }
  },
  render () {
    var headerClass = 'header navbar-fixed-top' + (this.state.didScroll ? ' didScroll' : '')
    return <header id='header' className={headerClass} ref={(e) => {
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
              {this.props.children}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  }
})

module.exports = Header
