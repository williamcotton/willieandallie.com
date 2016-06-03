var React = require('react')

var createGig = (gig) => {
  return <div key={gig.day + gig.month} className='item'>
    <div className='date-label'>
      <div className='number'>{gig.day}</div>
      <div className='month'>{gig.month}</div>
    </div>
    <div className='gig-info'>
      <div className='info-content'>
        <h3 className='gig-title'>{gig.title}</h3>
        <div className='meta'>
          <ul className='meta-list list-inline'>
            <li className='location'>
              <i className='fa fa-map-marker'></i><a href='#'>{gig.location}</a>
            </li>
            <li className='time'>
              <i className='fa fa-clock-o'></i>{gig.time}
            </li>
          </ul>
        </div>
      </div>
      <div className='gig-actions'>
        {gig.extraInfo ? <a className='btn btn-xs btn-ghost-secondary' data-toggle='collapse' aria-expanded='false' aria-controls='info-extra-1' >More info</a> : false}
        {gig.ticketUrl === true ? <a className='btn btn-xs btn-secondary' href={gig.ticketUrl}>Buy Tickets</a> : false}
      </div>
      {gig.extraInfo ? <div id='info-extra-1' className='collapse info-extra'></div> : false}
    </div>
  </div>
}

module.exports = class Gigs extends React.Component {
  render () {
    var gigs = this.props.gigs
    return <section id='gigs' className='gigs-section section' name='gigs'>
      <div className='container'>
        <h2 className='section-title text-center'>Upcoming Gigs</h2>
        <div className='gigs-container'>
          {gigs.map(createGig)}
        </div>
      </div>
    </section>
  }
}
