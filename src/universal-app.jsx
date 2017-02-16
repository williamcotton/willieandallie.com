var React = require('react')

const {Promo, Gigs, Music, Video, Contact} = require('./components/decibel')
const {Signup, Welcome, Login, ResetPassword, NewPassword, ResetPasswordEmailSent} = require('./components/auth')

var universalApp = ({app}) => {
  app.get('/', ({q, query: {didSignUp, emailAddress}}, {renderApp, Form}) => {
    q('{ upcomingGigs { title, day, month, location, time, extraInfo, ticketUrl } }').then(({data: {upcomingGigs}}) => {
      var album = {title: 'Between a Rock and a Country Place - EP', coverArtUrl: '/images/between-a-rock-and-a-hard-place.jpg', 'linkUrl': 'https://willieandallie.bandcamp.com'}
      renderApp(<div>
        <Promo
          headline='Willie & Allie'
          tagline='Between a Rock and a Country Place'
          images={[
            'https://dl.dropboxusercontent.com/s/7fouoq9g5ilv6oe/IMG_2271.jpg',
            'https://dl.dropboxusercontent.com/s/muv00c0c7kqbcie/00048_still.jpg',
            'https://dl.dropboxusercontent.com/s/07l7fd7zr4iexcm/00044_still.jpg'
          ]}
        />
        { upcomingGigs.size > 0 ? <Gigs gigs={upcomingGigs} /> : false }
        <Music
          album={album}
          bandcampUrl='https://willieandallie.bandcamp.com'
        />
        <Video
          videoSrc1='https://www.youtube.com/embed/MxETsJcBdlM?rel=0&amp;controls=0&amp;showinfo=0'
          videoSrc2='https://www.youtube.com/embed/QzsN7wvu0Lo?rel=0&amp;controls=0&amp;showinfo=0'
          youtubeUrl='https://www.youtube.com/user/PuffaloPhil'
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
        <Contact
          contactMessage=''
          bookingEmail='willieandallie@gmail.com'
          bandcampUrl='https://willieandallie.bandcamp.com'
          youtubeUrl='https://www.youtube.com/user/PuffaloPhil'
          spotifyUrl='https://open.spotify.com/album/0JsEVu8b6VFRfX9xVENZIs'
        />
      </div>)
    })
  })

  app.post('/newEmailListSignup', ({q, body: {emailAddress}}, {navigate}) => {
    q(`mutation { newEmailListSignup(emailAddress: "${emailAddress}") { emailAddress } }`).then((result) => {
      navigate('/', {didSignUp: true, emailAddress})
    })
  })

  require('./vendor/expect-universal-user-authentication')({
    app,
    login: { component: Login, successRedirect: '/' },
    signup: { component: Signup, successRedirect: '/' },
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
