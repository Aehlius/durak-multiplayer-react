import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as card from './Card';
import * as network from './Network';

//The classid Durak deck, composed of 33 cards, such as A (Ace) K (King) etc. as well as the card's type (s for spade, etc)
export let deck = ["1s", "1h", "1d", "1c", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "11s", "11h", "11d", "11c", "12s", "12h", "12d", "12c", "13s", "13h", "13d", "13c"];
export let hostHand = [];
export let otherHand = [];
export let table = [];
export let trump = [];
export let discard = [];

export let hosting;

export let turn = 0;
export let attacker = 'host';
export let numberOfAttacks = 0;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if(network.inGame === false) {
            setInterval(() => {
                this.setState({i: 0});
            }, 100);
        }
    }


    render(){
        if(network.inGame) {
            return <Game />
        } else {
            return <StartingPage />;

        }
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setInterval(() => {
            this.setState( {i: 0});
        }, 500);
    }

    render(){
        return (
            <>
                <h1>Durak</h1>
                <div id={"otherHand"}>
                    <card.DrawOtherHand table={table} hand={otherHand}/>
                </div>
                <div id={"OtherTable"}>
                </div>
                <div id={"Table"}>
                    <card.DrawTable table={table} color={'table'}/>
                </div>
                <div id={"hostHand"}>
                    <card.DrawHostHand table={table} hand={hostHand} color={'hostCard'}/>
                </div>
                <div id={"trumpSuit"}>
                    <card.Card value={trump[0]}/>
                </div>
                <div id={"Surrender"}>
                    <card.Card value={["End \n Turn"]} color={'surrender'}/>
                </div>
            </>
        );
    }
}

class StartingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {hosting: null, id: ''};
        this.joinGame = network.joinGame.bind(this);
    }


    host = () => {
        this.setState({hosting: true});
        hosting = true;
    }

    join = () => {
        this.setState({hosting: false});
        hosting = false;
    }

    back = () => {
        this.setState({hosting: null})
    }

    handleChange = (e) => {
        this.setState({id: e.target.value});
    }


    
    render(){
        if(this.state.hosting == null) {
            hostHand = [];
            otherHand = [];
            trump = [];
            return (
                <>
                    <h1>Durak!</h1>
                    <h2>Select an option below</h2>
                    <button id={"host"} className={"card startPage"} onClick={this.host}>Host game</button>
                    <button id={"join"} className={"card startPage"} onClick={this.join}>Join game</button>
                </>
            );
        } else if(this.state.hosting){
            //Initialize the players' hands, as well as the trump card, with a random card from the deck.
            card.setupCards(deck, hostHand, 6);
            card.setupCards(deck, otherHand, 6);
            card.setupCards(deck, trump, 1);

            let hostHandLowestTrump = 12;
            let otherHandLowestTrump = 12;

            if(hostHandLowestTrump === 12 || otherHandLowestTrump === 12) {
                for(let i = 0; i < hostHand.length; i++){
                    const hostHandCardVal = hostHand[i].gCV();

                    if(hostHand.slice(-1)[0] === trump.slice(-1)[0]) {
                        if(hostHandCardVal < hostHandLowestTrump){
                            hostHandLowestTrump = hostHandCardVal;
                        }
                    }
                }

                for(let i = 0; i < otherHand.length; i++){
                    const otherHandCardVal = otherHand[i].gCV();

                    if(otherHand[i].gCV(true)[1] === trump[0].gCV(true)[1] ) {
                        if(otherHandCardVal < otherHandLowestTrump){
                            otherHandLowestTrump = otherHandCardVal;
                        }
                    }
                }

                }

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
                    <input id={"idInput"} value={this.state.id} autoComplete={"off"} onChange={this.handleChange}/>
                    <br />
                    <button type={"submit"} id={"connect"} onClick={this.joinGame.bind(this, this.state.id)} >Connect</button>
                </>
            );
        }
    }
}


export function renderDom() {
    console.log('Rendered!');
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}


export function updateCards(data){
    if(data.table) {
        if(data.table.length === 0){
            table.splice(0)
        }

        for (var i = 0; i < data.table.length; i++) {
            if (!table.includes(data.table[i])) {
                if(turn % 2 === 0) {
                    hostHand.splice(hostHand.indexOf(data.table[i]), 1);
                    addTurn();
                } else {
                    otherHand.splice(otherHand.indexOf(data.table[i]), 1);
                    addTurn();
                }
                table.push(data.table[i]);
            }

            if(hostHand.includes(data.table[i])){
                hostHand.splice(hostHand.indexOf(data.table[i]), 1);
            }

            if(otherHand.includes(data.table[i])){
                otherHand.splice(otherHand.indexOf(data.table[i]), 1);
            }
        }
    }


    if(data.deck) {
        for (let i = 0; i <= data.deck.length; i++) {
            if (!deck.includes(data.deck[i]) && data.deck[i]) {
                deck.push(data.deck[i]);
            }
        }
    }

    if(data.hostHand) {
        for (let i = 0; i <= data.hostHand.length; i++) {
            if (!hostHand.includes(data.hostHand[i]) && data.hostHand[i]) {
                hostHand.push(data.hostHand[i]);
            }

            if(table.includes(data.hostHand[i])) {
                table.splice(table.indexOf(data.hostHand[i]), 1)
            }
        }
    }

    if(data.trump) {
        for (var i = 0; i <= data.trump.length; i++) {
            if (!trump.includes(data.trump[i]) && data.trump[i]) {
                trump.push(data.trump[i]);
            }

            if(table.includes(data.hostHand[i])) {
                table.splice(table.indexOf(data.hostHand[i]), 1)
            }
        }
    }

    if(data.otherHand) {
        for (let i = 0; i <= data.otherHand.length; i++) {
            if (!otherHand.includes(data.otherHand[i]) && data.otherHand[i]) {
                otherHand.push(data.otherHand[i]);
            }

            if(table.includes(data.otherHand[i])) {
                table.splice(table.indexOf(data.otherHand[i]), 1)
            }

        }
    }

    if(data.attacker){
        attacker = data.attacker;
    }

    if(data.turn){
        turn = data.turn;
    }


    renderDom();
}

String.prototype.gCV = function(suit){
    if(!suit) {
        return Number(this.match(/(\d+)/)[0]);
    } else {
        return [Number(this.match(/(\d+)/)[0]), this.slice(-1)[0]];
    }
}

//These 2 functions have to exist because of the weird way React allows different JavaScript files to access data
export function addTurn(changeAttacks){
    turn ++;
    if(changeAttacks === true || changeAttacks === null) {
        numberOfAttacks++;
    }
}

export function changeAttacker(player){
    numberOfAttacks = 0;

    if(player === null){
        if(attacker === 'host'){
            attacker = 'other';
        } else {
            attacker = 'host';
        }
    } else {
        attacker = player;
    }
}

renderDom();