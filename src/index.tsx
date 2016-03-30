import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface HelloWorldProps {
    name: string
}

class HelloMessage extends React.Component<HelloWorldProps, {}> {
    render() {
        return <p>Hello {this.props.name}</p>;
    }
}

ReactDOM.render(<HelloMessage name="John" />, document.getElementById('main'));