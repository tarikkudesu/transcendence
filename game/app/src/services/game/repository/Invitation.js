import { randomUUID } from 'crypto';
import * as Main from '../index.js';
export class Invitation {
	constructor(sender, recipient, game) {
		this.invite_status = 'pending';
		this.created_at = Date.now();
		this.recipient = recipient;
		this.sender = sender;
		this.game = game;
	}
}
/****************************************************************************************************************
 *                                      INVITATIONS TABLE MANIPULATION                                          *
 ****************************************************************************************************************/
export function getInvitation(sender, recipient) {
	const invite = Main.repository.invitations.get(sender + recipient);
	if (!invite) throw new Error(sender + recipient + ': no such invitation');
	return invite;
}
// * create invitation
export function createInvitation(sender, recipient, game) {
	if (sender === recipient) throw new Error('invited yourself, pretty smart huh!!');
	const sen = Main.getPlayer(sender);
	const rec = Main.getPlayer(recipient);
	if (Main.repository.invitations.has(sen.username + rec.username)) return;
	Main.repository.invitations.set(sen.username + rec.username, new Invitation(sen.username, rec.username, game));
}
// * update accepted invitation
export function acceptInvitation(sender, recipient) {
	const invite = getInvitation(sender, recipient);
	if (invite.invite_status === 'pending') {
		invite.invite_status = 'accepted';
		cancelInvitation(sender, recipient);
		Main.addRoom(sender, recipient, invite.game, randomUUID());
	}
}
// * update declined invitation
export function declineInvitation(sender, recipient) {
	const invite = getInvitation(sender, recipient);
	if (invite.invite_status === 'pending') invite.invite_status = 'declined';
}
// * cancel invitation
export function cancelInvitation(sender, recipient) {
	Main.repository.invitations.delete(sender + recipient);
}
// * delete all expired invitation
export function deleteExpiredInvitations() {
	Main.repository.invitations.forEach((value, key) => {
		if (Date.now() - value.created_at > Main.InvitationTimeout) Main.repository.invitations.delete(key);
	});
}
// * cancel all player invitations
export function cancelAllPlayerInvitations(sender) {
	Main.repository.invitations.forEach((value, key) => {
		if (value.sender === sender) Main.repository.invitations.delete(key);
	});
}
// * delete all rejected invitation for a specific user
export function deleteAllRejectedInvitations(sender) {
	Main.repository.invitations.forEach((value, key) => {
		if (value.sender === sender && value.invite_status === 'declined') Main.repository.invitations.delete(key);
	});
}
// * get all player invitations
export function getAllPlayerInvitations(username) {
	const invitations = [];
	Main.repository.invitations.forEach((value) => {
		if (value.recipient === username) invitations.push(new Main.ClientInvitation(value.sender, value.game, value.invite_status));
	});
	return invitations;
}
