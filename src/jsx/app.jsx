var React = require('react');

var App = React.createClass({
  render: function() {
    var content = this.props.content;
    return (
      <div className="app">
        <div className="content">
          { content }
        </div>
      </div>
    );
  }
});

module.exports = App;