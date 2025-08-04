import * as Main from '../index.js';
export function ErrorMessage(error) {
	return JSON.stringify(new Main.Message({ game: 'pong', message: 'ERROR', data: new Main.WSError(error) }));
}
// * POOL : PLAY | POOL | INVITATIONS
export function PlayMessage(game, gid) {
	return JSON.stringify(new Main.Message({ message: 'PLAY', game, data: new Main.Play(gid) }));
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
// * GAME : PONG | CARDOFDOOM
export function PongMessage(game, clientPong) {
	return JSON.stringify(new Main.Message({ message: 'PONG', game, data: clientPong }));
}
export function DoomMessage(game, clientCardOfDoom) {
	return JSON.stringify(new Main.Message({ message: 'DOOM', game, data: clientCardOfDoom }));
}
