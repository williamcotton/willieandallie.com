var React = require('react')
let {Modal} = require('react-bootstrap')

var Promo = require('./promo.jsx')
var Gigs = require('./gigs.jsx')
var Music = require('./music.jsx')
var Video = require('./video.jsx')
var Contact = require('./contact.jsx')

var universalApp = ({app, q}) => {
  app.get('/', (req, {renderApp}) => {
    q('{ gigs { title, day, month, location, time, extraInfo, ticketUrl } }').then(({data: {gigs}}) => {
      renderApp(<div>
        <Promo
          headline='Willie & Allie'
          tagline='Between a Rock and a Country Place'
          images={[
            'https://scontent.xx.fbcdn.net/t31.0-8/12068676_1283802311636319_3621862624206770528_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/11700709_1283798084970075_23460392268700948_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/10549095_1283797418303475_8280370772667950569_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/12829268_1283802014969682_2290074573821440146_o.jpg'
          ]}
        />
        <Gigs
          gigs={gigs}
        />
        <section className='section text-center'>
          <h3>Mailing List Signup</h3>
          <p>Enter your email address to receive a few updates a year!</p>
          <form action='/newEmailListSignup' className='form-inline has-warning'>
            <input placeholder='jane.doe@example.com' name='emailAddress' type='email' className='form-control form-control-warning' />
            <button type='submit' className='btn btn-ghost-primary'>Sign Up</button>
          </form>
        </section>
        <Music />
        <Video onClick={() => console.log(this)}/>
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
  })

  app.post('/newEmailListSignup', ({body: {emailAddress}}) => {
    q(`mutation { newEmailListSignup(emailAddress: "${emailAddress}") { emailAddress } }`).then((res) => {
      console.log(res)
    })
  })

  return app
}

module.exports = universalApp
