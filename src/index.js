import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {

  render(){
    return <h1>Hello, Durak!</h1>;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
