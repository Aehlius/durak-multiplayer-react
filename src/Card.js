import React from 'react';
import * as main from './index';
import * as net from './Network';

export class Card extends React.Component {
    constructor(props) {
        super(props);
        this.addToTableHost = this.addToTableHost.bind(this);
        this.addToTableOther = this.addToTableOther.bind(this);
        this.surrender = this.surrender.bind(this);
    }

    moveCardToTable(hand, other){
        moveCard(hand, this.props.table, hand.indexOf(this.props.value))
        main.renderDom();
        main.addTurn();

        if(other){
            net.sendData({table: main.table});
        }
    }



    addToTableHost(){
        console.log(main.attacker);
        let defenderHand;

        if(main.attacker === "host"){
            defenderHand = main.otherHand;
        } else {
            defenderHand = main.hostHand;
        }
        if(main.numberOfAttacks <= 6 || main.numberOfAttacks <= defenderHand.length) {
            if (main.numberOfAttacks <= 6) {
                if (main.hosting && main.turn % 2 === 0) {
                    const cardValue = this.props.value.gCV(true);
                    let latestTableCard;
                    const trumpValue = main.trump[0].gCV(true);
                    if (main.table.length > 0) {
                        latestTableCard = main.table.slice(-1)[0].gCV(true);
                    } else {
                        //This is done to make sure that any checks on the table will always equal true, if the table is empty
                        latestTableCard = cardValue;
                    }

                    if (cardValue[1] === trumpValue[1]) {
                        if (latestTableCard[1] === trumpValue[1]) {
                            if (main.table.length === 0 || cardValue[0] >= latestTableCard[0] && cardValue[1] === latestTableCard[1]) {
                                this.moveCardToTable(this.props.hostHand);
                            }
                        } else {
                            this.moveCardToTable(this.props.hostHand);
                        }
                    } else {
                        if (main.table.length === 0 || cardValue[0] >= latestTableCard[0] && cardValue[1] === latestTableCard[1]) {
                            this.moveCardToTable(this.props.hostHand);
                        }
                    }
                }
            }
        }
    }
    
    addToTableOther(){
        let defenderHand;

        if(main.attacker === "host"){
            defenderHand = main.otherHand;
        } else {
            defenderHand = main.hostHand;
        }
        if(main.numberOfAttacks <= 6 || main.numberOfAttacks <= defenderHand.length) {
            console.log(main.attacker);
            if (!main.hosting && main.turn % 2 !== 0) {
                const cardValue = this.props.value.gCV(true);
                let latestTableCard;
                if (main.table.length > 0) {
                    latestTableCard = main.table.slice(-1)[0].gCV(true);
                }
                const trumpValue = main.trump[0].gCV(true);

                if (cardValue[1] === trumpValue[1]) {
                    if (latestTableCard[1] === trumpValue[1]) {
                        if (main.table.length === 0 || cardValue[0] >= latestTableCard[0] && cardValue[1] === latestTableCard[1]) {
                            this.moveCardToTable(this.props.otherHand, true);
                        }
                    } else {
                        this.moveCardToTable(this.props.otherHand, true);
                    }
                } else {
                    if (main.table.length === 0 || cardValue[0] >= latestTableCard[0] && cardValue[1] === latestTableCard[1]) {
                        this.moveCardToTable(this.props.otherHand, true);
                    }
                }
            }
        }
    }

    surrender(){
        function newBout(newAttacker, loser){
            moveCards(main.table, loser);
            main.changeAttacker(newAttacker);
            main.addTurn();
            main.renderDom();

            if(newAttacker === 'other'){
                net.sendData({table: main.table, otherHand: main.otherHand, attacker: main.attacker, deck: main.deck});
            }

            if(main.deck.length >= 12) {
                setupCards(main.deck, main.hostHand, 6)
                setupCards(main.deck, main.otherHand, 6);
            } else {
                while(main.deck.length > 0){
                    moveCard(main.deck, main.hostHand, Math.floor(Math.random() * main.deck.length));
                    moveCard(main.deck, main.otherHand, Math.floor(Math.random() * main.deck.length));
                }
            }
        }

        if(main.hosting && main.turn % 2 === 0 && main.table.length > 0 && main.attacker === 'other'){
            newBout('host', main.hostHand)

        } else if (!main.hosting && main.turn % 2 !== 0 && main.table.length > 0 && main.attacker === 'host'){
            newBout('other', main.otherHand);

        } else if(main.hosting && main.turn % 2 === 0 && main.table.length > 0 && main.attacker === 'host'){
            newBout('other', main.discard);

        } else if(!main.hosting && main.turn % 2 !== 0 && main.table.length > 0 && main.attacker === 'other'){
            newBout('host', main.discard)

        }
    }

    render() {
        if (this.props.color === 'hostCard') {
            return <button className={"card hostCard"} onClick={this.addToTableHost}>{this.props.value}</button>;
        } else if (this.props.color === 'otherCard') {
            return <button className={"card otherCard"} onClick={this.addToTableOther}>{this.props.value}</button>;
        } else if (this.props.color === 'table') {
            return <button className={"card table"}>{this.props.value}</button>;
        } else if (this.props.color === 'surrender'){
            return <button className={"card"} id={"surrender"} onClick={this.surrender}>{this.props.value}</button>;
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

export function moveCards(initArray, finalArray){
    while (initArray.length > 0){
        moveCard(initArray, finalArray, 0)
    }
}

export function setupCards(deck, hand, numberOfCards){
    for(let i = hand.length; i < numberOfCards; i ++){
        moveCard(deck, hand, Math.floor(Math.random() * deck.length))
    }

}

