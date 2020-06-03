import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as card from './Card';
import * as network from './Network'

//The classid Durak deck, composed of 33 cards, such as A (Ace) K (King) etc. as well as the card's type (s for spade, etc)
var deck = ["As", "Ah", "Ad", "Ac", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "Js", "Jh", "Jd", "Jc", "Qs", "Qh", "Qd", "Qc", "Ks", "Kh", "Kd", "Kc"];
var myHand = [];
var otherHand = [];
var table = [];
var trump = [];

//Initialize the players' hands, as well as the trump card, with a random card from the deck.
card.setupCards(deck, myHand, 6);
card.setupCards(deck, otherHand, 6);
card.setupCards(deck, trump, 1);

class App extends React.Component {

    render(){
        return (
            <>
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
            </>
        );
    }
}

class StartingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {hosting: null};
    }


    host = () => {
        this.setState({hosting: true});
    }

    join = () => {
        this.setState({hosting: false});
    }

    back = () => {
        this.setState({hosting: null});
    }
    
    render(){
        if(this.state.hosting == null) {
            return (
                <>
                    <h1>Durak!</h1>
                    <h2>Select an option below</h2>
                    <button id={"host"} className={"card startPage"} onClick={this.host}>Host game</button>
                    <button id={"join"} className={"card startPage"} onClick={this.join}>Join game</button>
                </>
            );
        } else if(this.state.hosting){
            return (
                <>
                    <button id={"back"} className={"card"} onClick={this.back} key={"back"}>Back</button>
                    <h1>Durak!</h1>
                    <h2>Tell your friend(s) to connect to {network.id}</h2>
                </>
            );
        } else {
            return (
                <>
                    <button id={"back"} className={"card"} onClick={this.back} key={"back"}>Back</button>
                    <h1>Durak!</h1>
                    <h2>Connect to: </h2>
                    <input id={"idInput"}></input>
                    <br />
                    <button type={"submit"}>Connect</button>
                </>
            );
        }
    }
}


export function renderDom(){
    ReactDOM.render(
        <React.StrictMode>
            <StartingPage />
        </React.StrictMode>,
        document.getElementById('root')
    );

}

renderDom();
