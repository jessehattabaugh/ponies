require('../ui-ponies/ui-field');

const React = require('react');
const ReactDOM = require('react-dom');

const App = React.createClass({
  getInitialState: function () {
    return {
      name: 'World'
    };
  },
  render: function () {
    return <div>
      <h1>Hello {this.state.name}</h1>
      <ui-field oninput={ev => console.log(ev)}/>
    </div>;
  }
});

const root = document.createElement('main');
document.body.appendChild(root);

ReactDOM.render(<App/>, root);