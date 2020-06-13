import React from 'react';
import * as main from './index.js';

export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.addToTable = this.addToTable.bind(this);
    }

    addToTable(){
        if(this.props.color === 'hostCard') {
            moveCard(this.props.hostHand, this.props.table, this.props.hostHand.indexOf(this.props.value))
            main.renderDom();
        }
    }

    render() {
        if (this.props.color === 'hostCard') {
            return <button className={"card hostCard"} onClick={this.addToTable}>{this.props.value}</button>;
        } else if (this.props.color === 'otherCard') {
            return <button className={"card otherCard"}>{this.props.value}</button>;
        } else if (this.props.color === 'table') {
            return <button className={"card table"}>{this.props.value}</button>;
        } else {
            return <button className={"card"} id={"trumpCard"}>{this.props.value}</button>;
        }
    }
}



export function DrawHostHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card table = {props.table} hostHand={props.hand} value={props.hand[i]} color={'hostCard'} />);
    }

    return handToReturn;
}

export function DrawOtherHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} table = {props.table} hostHand={props.hostHand} color={'otherCard'} />);
    }

    return handToReturn;
}

export class DrawTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {table: this.props.table};
    }

    render(){
        var tableCardsToDraw = [];

        for (var i = 0; i < this.state.table.length; i++) {
            tableCardsToDraw.push(<Card value={this.state.table[i]} table = {this.props.table} hostHand={this.state.table} color={this.props.color}/>)
        }

        return tableCardsToDraw;

    }
}

export function moveCard(initArray, finalArray, cardIndex){
    finalArray.push(initArray[cardIndex]);
    initArray.splice(cardIndex, 1)
}

export function setupCards(deck, hand, numberOfCards){
    for(var i = hand.length; i < numberOfCards; i ++){
        moveCard(deck, hand, Math.floor(Math.random() * deck.length))
    }

}

