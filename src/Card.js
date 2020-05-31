export class Card extends React.Component {

    render() {
        if ('myCard' === this.props.player) {
            return <button className={"card myCard"} >{this.props.value}</button>;
        } else if (this.props.player === 'otherCard') {
            return <button className={"card otherCard"}>{this.props.value}</button>;
        } else if (this.props.player === 'table') {
            return <button className={"card"}>{this.props.value}</button>;
        } else {
            return <button className={"card trumpCard"}>{this.props.value}</button>;
        }
    }
}



export function DrawMyHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} player={'myCard'} />);
    }

    return handToReturn;
}

export function DrawOtherHand(props){
    var handToReturn = [];
    for(var i = 0; i < props.hand.length; i++){
        handToReturn.push(<Card value={props.hand[i]} player={'otherCard'} />);
    }

    return handToReturn;
}

export function DrawTable(props){
    var tableCardsToDraw = [];

    for(var i  = 0; i < props.tableCards.length; i++){
        tableCardsToDraw.push( <Card value={props.tableCards[i]} player={props.player}/>)
    }

    return tableCardsToDraw;
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