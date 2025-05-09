import { WS } from '../../shared/ws-server.js';

class newPlayer {
	constructor(username, socket) {
		this.username = username;
		this.socket = socket;
	}
}

class pdb {
	static #db = new Map();

	newPlayer(player) {
		pdb.#db.set(player.username, player);
	}
	getUser(username) {
		return pdb.#db.get(username);
	}
	send(username, data) {
		pdb.#db.get(username)?.socket.send(data);
	}
	broadcast(data) {
		pdb.#db.values().forEach((p) => {
			p.socket.send(data);
		});
	}
}

function useParse(data, socket) {
	if (data === '') return;
	try {
		const json = WS.Json({ message: data, target: Message.instance });
		// * connect, invite, play, hook
		if (json.message == 'connect') {
			const obj = WS.Json({ message: json.data, target: Connect.instance });
			pdb.newPlayer(new player(obj.username, socket));
		} else if (json.message == 'invite') {
		} else if (json.message == 'hook') {
		} else if (json.message === 'error') {
			throw new Error('Invalid message');
		}
	} catch (err) {
		console.error(err.message);
	}
}

export default async (fastify) => {
	fastify.get('/', { websocket: true }, (connection, req) => {
		console.log('Connected');
		connection.socket.on('message', (message) => {
			console.log(message.toString());
			// useParse(message.toString(), socket.socket);
		});
		connection.socket.on('close', (code, reason) => {});
	});
};
