import Peer from 'peerjs';
import words from './Words';
import * as main from './index';

function generateID(numberOfWords){
    var id = words[Math.floor(Math.random() * words.length)];
    for(var i = 0; i < numberOfWords - 1; i++){
        id += "_" + words[Math.floor(Math.random() * words.length)];
    }

    return id;
}

export var id = generateID(3);
export const p = new Peer("durak_" + id, {host: window.location.hostname, port: 9000});

export let inGame = false;

//This only runs on the host's machine
p.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

p.on('connection', function(conn) {
    conn.on('open', function() {
        inGame = true;
        console.log('Connected!');

        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
            if (typeof data === 'object') {
                main.updateCards(data);
            }

        });

        setInterval(function(){
            conn.send({table: main.table, deck: main.deck, hostHand: main.hostHand, otherHand: main.otherHand, trump: main.trump, turn: main.turn});
        }, 1000);

    });

});

let dataToSend;

export function sendData(table){
    dataToSend = table;
}

export function joinGame(id){
    const conn = p.connect("durak_" + id, {reliable: true});
    console.log('Connecting...');

    conn.on('open', function() {
        inGame = true;
        console.log('Connected!');

    });

    // Receive messages
    conn.on('data', function(data) {
        console.log('Received', data);
        if (typeof data === 'object') {
            main.updateCards(data);
        }
    });

    setInterval(function(){
        if(dataToSend !== null){
            conn.send(dataToSend);
            dataToSend = null;
        }
    }, 1)


}