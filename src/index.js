import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as card from './Card';

var deck = ["As", "Ah", "Ad", "Ac", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "Js", "Jh", "Jd", "Jc", "Qs", "Qh", "Qd", "Qc", "Ks", "Kh", "Kd", "Kc"];
var myHand = [];
var otherHand = [];
var table = [];
var trump = [];

card.setupCards(deck, myHand, 6);
card.setupCards(deck, otherHand, 6);
card.setupCards(deck, trump, 1);



class App extends React.Component {f

  render(){
    return (
        <div>
            <h1>Durak</h1>
            <div id={"otherHand"}>
                <card.DrawOtherHand hand={otherHand} />
            </div>
            <div id={"OtherTable"}>
            </div>
            <div id={"MyTable"}>
                <card.DrawMyTable table={table} color={'table'}/>
            </div>
            <div id={"myHand"}>
                <card.DrawMyHand table={table} hand={myHand} color={'myCard'} />
            </div>
            <div id={"trumpSuit"}>
                <card.Card value={trump[0]} />
            </div>
        </div>
    );
  }
}


export function renderDom(){
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );

}

renderDom();
