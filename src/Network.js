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
export const peer = new Peer("durak-" + id);

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});