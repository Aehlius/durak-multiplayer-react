import Peer from 'peerjs';
import words from './Words';

function generateID(numberOfWords){
    var id = words[Math.floor(Math.random() * words.length)];
    for(var i = 0; i < numberOfWords - 1; i++){
        id += "-" + words[Math.floor(Math.random() * words.length)];
    }

    return id;
}

export var id = generateID(3);
export const p = new Peer("durak-" + id, {host: window.location.hostname, port: 9000});

export let conn = null;

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
        });

        // Send messages
        conn.send('Hola mundo!');

    });

});




export function sendData(id, data){
    var conn = p.connect("durak-" + id);
    conn.reliable = true;

    console.log('Connecting to durak-' + id + '...');

    //Sometimes the connection simply never opens
    conn.on('open', function() {
        console.log('Connected!');
        inGame = true;

        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });
    });

    //Sometimes the connection is open but no data is sent
    conn.send(data);
}