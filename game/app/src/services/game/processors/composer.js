import * as Main from '../index.js';
export function ErrorMessage(error) {
	return JSON.stringify(new Main.Message({ game: 'pong', message: 'ERROR', data: new Main.WSError(error) }));
}
// * POOL : PLAY | POOL | INVITATIONS
export function PlayMessage(game, gid, opponent) {
	return JSON.stringify(new Main.Message({ message: 'PLAY', game, data: new Main.Play(gid, opponent) }));
}
export function PoolMessage(game, getClientPlayers) {
	return JSON.stringify(new Main.Message({ message: 'POOL', game, data: new Main.Pool(getClientPlayers()) }));
}
export function InvitationMessage(game, getInvitions) {
	return JSON.stringify(new Main.Message({ message: 'INVITATIONS', game, data: new Main.Invitations(getInvitions()) }));
}
export function TournamentMessage(game, clientTournament) {
	return JSON.stringify(new Main.Message({ message: 'TOURNAMENT', game, data: clientTournament }));
}
export function TournamentsMessage(t) {
	return JSON.stringify(new Main.Message({ message: 'TOURNAMENTS', game: 'pong', data: t }));
}
// * GAME : PONG | CARDOFDOOM
export function PongMessage(clientPong) {
	return JSON.stringify(new Main.Message({ message: 'PONG', game: 'pong', data: clientPong }));
}
export function DoomMessage(clientCardOfDoom) {
	return JSON.stringify(new Main.Message({ message: 'DOOM', game: 'card of doom', data: clientCardOfDoom }));
}
export function WonMessage() {
	return JSON.stringify(new Main.Message({ message: 'WON', game: 'card of doom', data: {} }));
}
export function LostMessage() {
	return JSON.stringify(new Main.Message({ message: 'LOST', game: 'card of doom', data: {} }));
}
export function DisconnectMessage() {
	return JSON.stringify(new Main.Message({ message: 'DISCONNECTED', game: 'card of doom', data: {} }));
}
