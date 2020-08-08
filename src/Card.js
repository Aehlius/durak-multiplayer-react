import React from 'react';
import * as main from './index';
import * as net from './Network';

export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.addToTableHost = this.addToTableHost.bind(this);
        this.addToTableOther = this.addToTableOther.bind(this)
    }

    moveCard(hand, other){
        moveCard(hand, this.props.table, hand.indexOf(this.props.value))
        main.renderDom();
        main.addTurn();

        if(other){
            net.sendData({table: main.table});
        }
    }



    addToTableHost(){
        if(main.hosting && main.turn % 2 === 0) {
            const cardValue = this.props.value.gCV(true);
            let latestTableCard;
            if(main.table.length > 0) {
                latestTableCard = main.table.slice(-1)[0].gCV(true);
            }
            const trumpValue = main.trump[0].gCV(true);

            if(cardValue[1] === trumpValue[1]){
                if(latestTableCard[1] === trumpValue[1]){
                    if (main.table.length === 0 || cardValue[0] >= latestTableCard[0]) {
                        this.moveCard(this.props.hostHand);
                    }
                } else {
                    this.moveCard(this.props.hostHand);
                }
            } else {
                if (main.table.length === 0 || cardValue[0] >= latestTableCard[0]) {
                    this.moveCard(this.props.hostHand);
                }
            }
        }
    }
    
    addToTableOther(){
        if(!main.hosting && main.turn % 2 !== 0){
            const cardValue = this.props.value.gCV(true);
            let latestTableCard;
            if(main.table.length > 0) {
                latestTableCard = main.table.slice(-1)[0].gCV(true);
            }
            const trumpValue = main.trump[0].gCV(true);

            if(cardValue[1] === trumpValue[1]){
                if(latestTableCard[1] === trumpValue[1]){
                    if (main.table.length === 0 || cardValue[0] >= latestTableCard[0]) {
                        this.moveCard(this.props.otherHand, true);
                    }
                } else {
                    this.moveCard(this.props.otherHand, true);
                }
            } else {
                if (main.table.length === 0 || cardValue[0] >= latestTableCard[0]) {
                    this.moveCard(this.props.otherHand, true);
                }
            }
        }
    }

    render() {
        if (this.props.color === 'hostCard') {
            return <button className={"card hostCard"} onClick={this.addToTableHost}>{this.props.value}</button>;
        } else if (this.props.color === 'otherCard') {
            return <button className={"card otherCard"} onClick={this.addToTableOther}>{this.props.value}</button>;
        } else if (this.props.color === 'table') {
            return <button className={"card table"}>{this.props.value}</button>;
        } else {
            return <button className={"card"} id={"trumpCard"}>{this.props.value}</button>;
        }
    }
}


String.prototype.gCV = function(suit){
    if(!suit) {
        return Number(this.match(/(\d+)/)[0]);
    } else {
        return [Number(this.match(/(\d+)/)[0]), this.slice(-1)[0]];
    }
}

export function DrawHostHand(props){
    let handToReturn = [];
    for(let i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card table = {props.table} hostHand={props.hand} value={props.hand[i]} color={'hostCard'} />);
    }

    return handToReturn;
}

export function DrawOtherHand(props){
    let handToReturn = [];
    for(let i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card table = {props.table} otherHand={props.hand} value={props.hand[i]} color={'otherCard'} />);
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
    for(let i = hand.length; i < numberOfCards; i ++){
        moveCard(deck, hand, Math.floor(Math.random() * deck.length))
    }

}

