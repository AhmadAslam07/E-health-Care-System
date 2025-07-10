const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/' });

peerServer.on('connection', client => {
  console.log('Client connected:', client.id);
});

console.log('PeerJS Server running on http://localhost:9000');
