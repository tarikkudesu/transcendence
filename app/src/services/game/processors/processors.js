import * as Main from '../index.js';
import _ from 'lodash';
// ? Comminication Helpers
export function Json({ message, target }) {
	const json = JSON.parse(message);
	const properties = Object.getOwnPropertyNames(json);
	Object.getOwnPropertyNames(target).forEach((property) => {
		if (_.includes(properties, property) === false) throw new Error('Invalid JSON');
	});
	return json;
}
/************************************************************************************************************************
 *                                                        PARSER                                                        *
 ************************************************************************************************************************/
export function connectPlayer(username, socket) {
	Main.addPlayer(Main.createPlayer(username, socket));
}
export function useParser(username, json) {
	const { message, game, data } = Json({ message: json, target: Main.Message.instance });
	switch (message) {
		case 'REGISTER': {
			Main.register(username, Json({ message: data, target: Main.Register.instance }).alias);
			break;
		}
		case 'ENGAGE': {
			Main.connectPlayer(username, Json({ message: data, target: Main.Engage.instance }).gid, game);
			break;
		}
		case 'INVITE': {
			Main.createInvitation(username, Json({ message: data, target: Main.Invite.instance }).recipient, game);
			break;
		}
		case 'ACCEPT': {
			Main.acceptInvitation(Json({ message: data, target: Main.Invite.instance }).recipient, username);
			break;
		}
		case 'REJECT': {
			Main.declineInvitation(Json({ message: data, target: Main.Invite.instance }).recipient, username);
			break;
		}
		case 'DELETE': {
			const invite = Json({ message: data, target: Main.Invite.instance });
			if (invite.recipient === '*') Main.deleteAllRejectedInvitations(username);
			else Main.cancelInvitation(invite.recipient, username);
			break;
		}
		case 'HOOK': {
			Main.roomHook(username, Json({ message: data, target: Main.Hook.instance }));
			break;
		}
		case 'FLIP': {
			Main.roomFlip(username, Json({ message: data, target: Main.Flip.instance }));
			break;
		}
		case 'TYNICHAT': {
			Main.roomTinyChat(username, Json({ message: data, target: Main.TinyChat.instance }));
			break;
		}
		default:
			throw new Error('UNKNOWN COMMAND');
	}
}
