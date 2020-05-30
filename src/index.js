import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'


var p1Deck;
var p2Deck;

var deck = ["As", "Ah", "Ad", "Ac", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "Js", "Jh", "Jd", "Jc", "Qs", "Qh", "Qd", "Qc", "Ks", "Kh", "Kd", "Kc"];

function Card(props) {
    if(props.player === 'myCard') {
        return <button className={"card myCard"}>{props.value}</button>;
    } else if(props.player === 'otherCard'){
        return <button className={"card otherCard"}>{props.value}</button>;
    }
}

var myHand = ["As", "Ah", "Ad", "Ac", "6s", "6h"];

var otherHand = ["As", "Ah", "Ad", "Ac", "6s", "6h"];


function DrawMyHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} player={'myCard'} />);
    }

    return handToReturn;
}

function DrawOtherHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} player={'otherCard'} />);
    }

    return handToReturn;
}


class App extends React.Component {

  render(){
    return (
        <div>
            <h1>Hello, Durak!</h1>
            <div id={"otherHand"}>
                <DrawOtherHand hand={otherHand} />
            </div>
            <div id={"myHand"}>
                <DrawMyHand hand={myHand} />
            </div>
        </div>
    );
  }
}




ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
