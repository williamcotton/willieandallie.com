var React = require('react')
//let {Modal} = require('react-bootstrap')

var Promo = require('./promo.jsx')
var Gigs = require('./gigs.jsx')
var Music = require('./music.jsx')
var Video = require('./video.jsx')
var Contact = require('./contact.jsx')
var Signup = require('./signup.jsx')
var Welcome = require('./welcome.jsx')
var Login = require('./login.jsx')
var ResetPassword = require('./reset-password.jsx')
var NewPassword = require('./new-password.jsx')
var ResetPasswordEmailSent = require('./reset-password-email-sent.jsx')

var universalApp = ({app}) => {
  app.get('/', ({q, query: {didSignUp}}, {renderApp}) => {
    q('{ upcomingGigs { title, day, month, location, time, extraInfo, ticketUrl } }').then(({data: {upcomingGigs}}) => {
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
          gigs={upcomingGigs}
        />
        <section className='section text-center center-block'>
          <h3>Mailing List Signup</h3>
          <p>Signup to receive emails about new releases and gigs!</p>
          <form action='/newEmailListSignup' method='post' className='form-inline has-warning'>
            <input placeholder='jane.doe@example.com' name='emailAddress' type='email' className='form-control form-control-warning' />
            <button type='submit' className='btn btn-ghost-primary'>Sign Up</button>
          </form>
        </section>
        <Music />
        <Video />
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

  app.post('/newEmailListSignup', ({q, body: {emailAddress}}, {redirect, send}) => {
    q(`mutation { newEmailListSignup(emailAddress: "${emailAddress}") { emailAddress } }`).then((res) => {
      console.log('newEmailListSignup result', res)
      //redirect('/')
      //send('ok')
    })
  })

  require('../js/lib/expect-universal-user-authentication')({
    app,
    login: { component: Login, successRedirect: '/welcome' },
    signup: { component: Signup, successRedirect: '/welcome' },
    logout: { successRedirect: '/' },
    resetPassword: { component: ResetPassword, successComponent: ResetPasswordEmailSent },
    newPassword: { component: NewPassword }
  })

  var userRequired = ({user}, {renderApp}, next) => {
    if (!user) {
      return renderApp(<h2>Login Required!</h2>, {title: 'Login Required'})
    }
    next()
  }

  app.get('/welcome', userRequired, (req, {renderApp}) => {
    renderApp(<Welcome />, {title: 'Welcome'})
  })

  return app
}

module.exports = universalApp
