import Peer from 'peerjs';
import words from './Words';
import * as app from './index';

function generateID(numberOfWords){
    var id = words[Math.floor(Math.random() * words.length)];
    for(var i = 0; i < numberOfWords - 1; i++){
        id += "-" + words[Math.floor(Math.random() * words.length)];
    }

    return id;
}

export var id = generateID(3);
export const p = new Peer("durak-" + id, {host: window.location.hostname, port: 9000});

export let inGame = false;

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
                app.updateCards(data);
            }

        });

        // Send messages
        conn.send('Hola mundo!');

    });

});



export function sendData(id){
    const conn = p.connect("durak-" + id, {reliable: true});
    console.log('Connecting...')

    conn.on('open', function() {
        inGame = true;
        console.log('Connected!')
        // Send messages
        conn.send('Hello!');
        setInterval(function(){
            conn.send({table: app.table});
        }, 1000);

    });

    // Receive messages
    conn.on('data', function(data) {
        console.log('Received', data);
    });


}