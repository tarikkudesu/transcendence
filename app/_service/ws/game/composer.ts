import * as Main from './index';

// ? Protocole Message Builders

// ? CONNECT, ENGAGE, INVITE, ACCEPT, REJECT, DELETE, HOOK, FLIP, REGISTER
// * HASH, POOL, INVITATIONS, PLAY, PONG, DOOM, TOURNAMENT, ERROR

export function InviteMessage(game: 'pong' | 'card of doom', recipient: string): string {
	return JSON.stringify(new Main.Message({ message: 'INVITE', game, data: new Main.Invite(recipient) }));
}
export function AcceptMessage(game: 'pong' | 'card of doom', recipient: string): string {
	return JSON.stringify(new Main.Message({ message: 'ACCEPT', game, data: new Main.Invite(recipient) }));
}
export function RejectMessage(game: 'pong' | 'card of doom', recipient: string): string {
	return JSON.stringify(new Main.Message({ message: 'REJECT', game, data: new Main.Invite(recipient) }));
}
export function DeleteMessage(game: 'pong' | 'card of doom', recipient: string): string {
	return JSON.stringify(new Main.Message({ message: 'DELETE', game, data: new Main.Invite(recipient) }));
}

export function HookMessage(game: 'pong' | 'card of doom', gid: string, up: boolean, down: boolean): string {
	return JSON.stringify(new Main.Message({ message: 'HOOK', game, data: new Main.Hook(gid, up, down) }));
}
export function FlipMessage(game: 'pong' | 'card of doom', gid: string, pos: number): string {
	return JSON.stringify(new Main.Message({ message: 'FLIP', game, data: new Main.Flip(gid, pos) }));
}
export function RegisterMessage(game: 'pong' | 'card of doom', name: string): string {
	return JSON.stringify(new Main.Message({ message: 'REGISTER', game, data: new Main.Register(name) }));
}

