/// <reference path="../typings/tsd.d.ts" />
import React = require('react');
import ReactDOM = require('react-dom');

interface HelloWorldProps {
  name: string;
}

var HelloMessage = React.createClass<HelloWorldProps, any>({
  render: function() {
    return <p>Hello {this.props.name}</p>;
  }
});

ReactDOM.render(<HelloMessage name="John" />, document.getElementById('main'));