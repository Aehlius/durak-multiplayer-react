import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as card from './Card';
import * as network from './Network';

//The classid Durak deck, composed of 33 cards, such as A (Ace) K (King) etc. as well as the card's type (s for spade, etc)
export let deck = ["As", "Ah", "Ad", "Ac", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "Js", "Jh", "Jd", "Jc", "Qs", "Qh", "Qd", "Qc", "Ks", "Kh", "Kd", "Kc"];
export let hostHand = [];
export let otherHand = [];
export let table = [];
export let trump = [];

let hosting;

//Initialize the players' hands, as well as the trump card, with a random card from the deck.
card.setupCards(deck, hostHand, 6);
card.setupCards(deck, otherHand, 6);
card.setupCards(deck, trump, 1);

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
            if(hosting){
                //network.sendData(network.conn.id, {table: table});
            }
            this.setState( {i: 0});
        }, 500);
    }

    render(){
        return (
            <>
                <h1>Durak</h1>
                <div id={"otherHand"}>
                    <card.DrawOtherHand hand={otherHand}/>
                </div>
                <div id={"OtherTable"}>
                </div>
                <div id={"Table"}>
                    <card.DrawTable table={table} color={'table'}/>
                </div>
                <div id={"hostHand"}>
                    <card.DrawHostHand table={table} hand={hostHand
                    } color={'hostCard'}/>
                </div>
                <div id={"trumpSuit"}>
                    <card.Card value={trump[0]}/>
                </div>
            </>
        );
    }
}

class StartingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {hosting: null, id: ''};
        this.sendData = network.sendData.bind(this);
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
                    <input id={"idInput"} value={this.state.id} autoComplete={"off"} onChange={this.handleChange}></input>
                    <br />
                    <button type={"submit"} id={"connect"} onClick={this.sendData.bind(this, this.state.id)} >Connect</button>
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
    for(var i = 0; i <= data.table.length; i++){
        if(!table.includes(data.table[i]) && data.table[i]) {
            table.push(data.table[i]);
        }
    }

    for(var i = 0; i <= data.otherHand.length; i++){
        if(!otherHand.includes(data.otherHand[i]) && data.otherHand[i]) {
            otherHand.push(data.otherHand[i]);
        }
    }
    renderDom();
}



renderDom();