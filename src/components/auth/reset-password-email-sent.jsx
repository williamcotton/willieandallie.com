var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Alert = ReactBootstrap.Alert

var ResetPasswordEmailSent = React.createClass({
  propTypes: {
    errors: React.PropTypes.array,
    formAction: React.PropTypes.string
  },
  render: function () {
    return <section className='auth-section section text-center'>
      <h1>Reset Password Email Sent</h1>
      <Alert bsStyle='success'>Please <strong>check your email</strong> for instructions on how to reset your password.</Alert>
    </section>
  }
})

module.exports = ResetPasswordEmailSent
