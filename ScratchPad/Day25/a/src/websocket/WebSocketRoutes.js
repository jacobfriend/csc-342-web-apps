const express = require('express');
const websocketRouter = express.Router();

/******************\
* WEBSOCKET ROUTES *
\******************/

const messages = [];
const clients = new Set();

function sendPacket (ws, label, data) {
	let packet = {
		label: label, //This will identify the nature of the data
		data: data
	}
	ws.send(JSON.stringify(packet));
}

websocketRouter.ws('/ws', (ws, req) => {
  console.log('New client');
	clients.add(ws);
	sendPacket(ws, 'init', messages);

	ws.on('close', e => {
		console.log('Client disconnected');
    clients.delete(ws);
	})

	ws.on('message', function(msg) {
    console.log(msg);
		const packet = JSON.parse(msg);
		console.log(packet.label);
		switch (packet.label) {
			case 'chat':
				messages.push(packet.data);
				clients.forEach((client) => {
					if (client !== ws) {
						client.send(msg);
					}
				});
			break;
		}
  });
});

module.exports = websocketRouter;