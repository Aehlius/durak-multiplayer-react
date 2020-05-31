import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var deck = ["As", "Ah", "Ad", "Ac", "6s", "6h", "6d", "6c", "7s", "7h", "7d", "7c", "8s", "8h", "8d", "8c", "9s", "9h", "9d", "9c", "10s", "10h", "10d", "10c", "Js", "Jh", "Jd", "Jc", "Qs", "Qh", "Qd", "Qc", "Ks", "Kh", "Kd", "Kc"];
var myHand = [];
var otherHand = [];
var table = [];
var trump = [];

setupCards(deck, myHand, 6);
setupCards(deck, otherHand, 6);
setupCards(deck, trump, 1);



class App extends React.Component {f

  render(){
    return (
        <div>
            <h1>Durak</h1>
            <div id={"otherHand"}>
                <DrawOtherHand hand={otherHand} />
            </div>
            <div id={"OtherTable"}>
            </div>
            <div id={"MyTable"}>
                <DrawMyTable color={'table'}/>
            </div>
            <div id={"myHand"}>
                <DrawMyHand hand={myHand} color={'myCard'} />
            </div>
            <div id={"trumpSuit"}>
                <Card value={trump[0]} />
            </div>
        </div>
    );
  }
}


export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.addToTable = this.addToTable.bind(this);
    }

    addToTable(){
        if(this.props.color === 'myCard') {
            moveCard(myHand, table, myHand.indexOf(this.props.value))
            renderDom();
        }
    }

    render() {
        if (this.props.color === 'myCard') {
            return <button className={"card myCard"} onClick={this.addToTable}>{this.props.value}</button>;
        } else if (this.props.color === 'otherCard') {
            return <button className={"card otherCard"}>{this.props.value}</button>;
        } else if (this.props.color === 'table') {
            return <button className={"card table"}>{this.props.value}</button>;
        } else {
            return <button className={"card trumpCard"}>{this.props.value}</button>;
        }
    }
}



function DrawMyHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} color={'myCard'} />);
    }

    return handToReturn;
}

function DrawOtherHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} color={'otherCard'} />);
    }

    return handToReturn;
}

class DrawMyTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {table: table};
    }

    render(){
        var tableCardsToDraw = [];

        for (var i = 0; i < this.state.table.length; i++) {
            tableCardsToDraw.push(<Card value={this.state.table[i]} color={this.props.color}/>)
        }

        return tableCardsToDraw;

    }
}

function moveCard(initArray, finalArray, cardIndex){
    finalArray.push(initArray[cardIndex]);
    initArray.splice(cardIndex, 1)
}

function setupCards(deck, hand, numberOfCards){
    for(var i = hand.length; i < numberOfCards; i ++){
        moveCard(deck, hand, Math.floor(Math.random() * deck.length))
    }

}



function renderDom(){
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );

}

renderDom();
