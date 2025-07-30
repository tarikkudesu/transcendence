import * as Main from '../index.js';
export function ErrorMessage(error) {
    return JSON.stringify(new Main.Message({ username: '', hash: '', game: 'pong', message: 'ERROR', data: new Main.WSError(error) }));
}
// * POOL : HASH | PLAY | POOL | INVITATIONS
export function HashMessage(username, hash, game) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'HASH', game, data: new Main.Hash(username, hash) }));
}
export function PlayMessage(username, hash, game, gid) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'PLAY', game, data: new Main.Play(gid) }));
}
export function PoolMessage(username, hash, game, getClientPlayers) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'POOL', game, data: new Main.Pool(getClientPlayers()) }));
}
export function InvitationMessage(username, hash, game, getInvitions) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'INVITATIONS', game, data: new Main.Invitations(getInvitions()) }));
}
export function TournamentMessage(username, hash, game, clientTournament) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'TOURNAMENT', game, data: clientTournament }));
}
// * GAME : PONG | CARDOFDOOM
export function PongMessage(username, hash, game, clientPong) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'PONG', game, data: clientPong }));
}
export function DoomMessage(username, hash, game, clientCardOfDoom) {
    return JSON.stringify(new Main.Message({ username, hash, message: 'DOOM', game, data: clientCardOfDoom }));
}
