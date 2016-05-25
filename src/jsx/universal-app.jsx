var React = require('react')

var Promo = require('./promo.jsx')
var Gigs = require('./gigs.jsx')
var Music = require('./music.jsx')
var Contact = require('./contact.jsx')

var gigs = [
  {
    title: 'Decibel Lorem Ipsum, London',
    day: 16,
    month: 'OCT',
    location: 'Dingwalls, London',
    time: '9:00pm, Saturday',
    extraInfo: <div>Sed feugiat varius felis pulvinar tincidunt. Donec bibendum fermentum justo, sit amet commodo augue porta in. Etiam lacinia quam vel ante <a href='#'>link example</a> aliquam euismod. Nam vitae molestie purus. Suspendisse id erat quis leo molestie laoreet at eget libero. In eget ipsum leo.</div>,
    ticketUrl: false
  }
]

var universalApp = ({app}) => {
  app.get('/', (req, {renderApp}) => {
    renderApp(<div>
      <Promo
        headline='Willie & Allie'
        tagline='Country Music'
      />
      <Gigs
        gigs={gigs}
      />
      <Music />
      <Contact
        contactMessage='Sed feugiat varius felis pulvinar tincidunt. Donec bibendum fermentum justo, sit amet commodo augue porta in.'
        bookingEmail='willieandallie@gmail.com'
        itunesUrl='#'
        bandcampUrl='#'
        facebookUrl='https://www.facebook.com/willieandallie'
        youtubeUrl='https://www.youtube.com/user/PuffaloPhil'
      />
    </div>)
  })

  return app
}

module.exports = universalApp
