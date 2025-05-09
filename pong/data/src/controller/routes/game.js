import { WS, Message, Connect } from '../../shared/ws-server.js';

class newPlayer {
	#sent = new Map();
	#received = new Map();
	constructor(username, socket) {
		this.username = username;
		this.socket = socket;
		this.socket.username = username;
	}
	addInvite(username) {
		if (!this.#invitates.get(username)) this.#invitates.set()
	}
	clearInvites() {
		this.#invitates.clear();
	}
}

class pdb {
	static #db = new Map();

	static connect(player) {
		pdb.#db.set(player.username, player);
	}
	static disconnect(username) {
		pdb.#db.delete(username);
	}
	static getUser(username) {
		return pdb.#db.get(username);
	}
	getUsers() {
		return pdb.#db.values();
	}
	static send(username, data) {
		pdb.#db.get(username)?.socket.send(data);
	}
	static broadcast(data) {
		pdb.#db.values().forEach((p) => {
			p.socket.send(data);
		});
	}
	// static inviteUser() {
	// 	pdb.#db.get(username)?.
	// }

	// ! Game Loop
	static gameLoop() {}
	static main() {
		setInterval(pdb.gameLoop, 1000 / 60);
	}
}

function useParse(data, socket) {
	if (data === '') return;
	try {
		const json = WS.Json({ message: data, target: Message.instance });
		// * connect, invite, play, hook
		if (json.message == 'connect') {
			const obj = WS.Json({ message: json.data, target: Connect.instance });
			pdb.connect(new newPlayer(obj.username, socket));
		} else if (json.message === 'invite') {
		} else if (json.message === 'play') {
		} else if (json.message === 'hook') {
		} else if (json.message === 'error') {
			throw new Error('Invalid message');
		}
	} catch (err) {
		console.error(err.message);
	}
}

export default async (fastify) => {
	fastify.get('/', { websocket: true }, (connection, req) => {
		connection.on('message', (message) => {
			useParse(message.toString(), connection);
		});
		connection.on('error', (err) => {
			pdb.disconnect(connection.username);
		});
		connection.on('close', (code, reason) => {
			pdb.disconnect(connection.username);
		});
	});
};
