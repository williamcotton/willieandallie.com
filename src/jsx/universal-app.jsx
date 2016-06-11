var React = require('react')

const {Promo, Gigs, Music, Video, Contact} = require('./decibel')
const {Signup, Welcome, Login, ResetPassword, NewPassword, ResetPasswordEmailSent} = require('./auth')

var universalApp = ({app}) => {
  app.get('/', ({q, query: {didSignUp, emailAddress}}, {renderApp, Form}) => {
    q('{ upcomingGigs { title, day, month, location, time, extraInfo, ticketUrl } }').then(({data: {upcomingGigs}}) => {
      var album = {title: 'Between a Rock and a Country Place - EP', coverArtUrl: '/images/between-a-rock-and-a-hard-place.jpg'}
      renderApp(<div>
        <Promo
          headline='Willie & Allie'
          tagline='Between a Rock and a Country Place'
          images={[
            'https://scontent.xx.fbcdn.net/t31.0-8/12068676_1283802311636319_3621862624206770528_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/10549095_1283797418303475_8280370772667950569_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/12829268_1283802014969682_2290074573821440146_o.jpg',
            'https://scontent.xx.fbcdn.net/t31.0-8/13346268_1345111445505405_2976367559297847705_o.jpg'
          ]}
        />
        <Gigs
          gigs={upcomingGigs}
        />
        <section className='mailing-list-section section text-center center-block'>
          <h3>Mailing List Signup</h3>
          <p>Signup to receive emails about new releases and gigs!</p>
          <Form action='/newEmailListSignup' method='post' className='form-inline has-warning'>
            <input placeholder='jane.doe@example.com' name='emailAddress' type='email' className='form-control form-control-warning' />
            <button type='submit' className='btn btn-ghost-primary'>Sign Up</button>
          </Form>
          {didSignUp ? <p className='alert alert-success'>{emailAddress} has been added to our email list.</p> : false}
        </section>
        <Music
          album={album}
          bandcampUrl='https://willieandallie.bandcamp.com'
        />
        <Video
          videoSrc1='https://www.youtube.com/embed/MxETsJcBdlM?rel=0&amp;controls=0&amp;showinfo=0'
          videoSrc2='https://www.youtube.com/embed/QzsN7wvu0Lo?rel=0&amp;controls=0&amp;showinfo=0'
          youtubeUrl='https://www.youtube.com/user/PuffaloPhil'
        />
        <Contact
          contactMessage=''
          bookingEmail='willieandallie@gmail.com'
          bandcampUrl='https://willieandallie.bandcamp.com'
          facebookUrl='https://www.facebook.com/willieandallie'
          youtubeUrl='https://www.youtube.com/user/PuffaloPhil'
        />
      </div>)
    })
  })

  app.post('/newEmailListSignup', ({q, body: {emailAddress}}, res) => {
    q(`mutation { newEmailListSignup(emailAddress: "${emailAddress}") { emailAddress } }`).then((result) => {
      res.redirect('/?didSignUp=true&emailAddress=' + emailAddress)
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

  const userRequired = ({user}, {renderApp}, next) => {
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
