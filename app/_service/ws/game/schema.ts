interface MessageProps {
	message: string;
	game: 'pong' | 'card of doom';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
export class Message {
	public message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public data: any;
	public game: 'pong' | 'card of doom';
	constructor({ message, data, game }: MessageProps) {
		this.data = JSON.stringify(data);
		this.message = message;
		this.game = game;
	}
	static instance = new Message({ message: '', data: {}, game: 'pong' });
}

export class WSError {
	public message: string;
	constructor(error: string) {
		this.message = error;
	}
	static instance = new WSError('');
}

export class ClientPlayer {
	public username: string;
	public game: 'pong' | 'card of doom';
	public playerStatus: 'playing' | 'free';
	public inviteStatus: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(
		username: string,
		game: 'pong' | 'card of doom',
		playerStatus: 'playing' | 'free',
		inviteStatus: 'unsent' | 'pending' | 'accepted' | 'declined'
	) {
		this.inviteStatus = inviteStatus;
		this.playerStatus = playerStatus;
		this.username = username;
		this.game = game;
	}
	static instance = new ClientPlayer('', 'pong', 'free', 'unsent');
}

export class ClientInvitation {
	public sender: string;
	public game: 'pong' | 'card of doom';
	public inviteStatus: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(sender: string, game: 'pong' | 'card of doom', inviteStatus: 'unsent' | 'pending' | 'accepted' | 'declined') {
		this.inviteStatus = inviteStatus;
		this.sender = sender;
		this.game = game;
	}
	static instance = new ClientInvitation('', 'pong', 'unsent');
}

export type TournamentStateTYPE = 'not open' | 'open' | 'playing' | 'finished';
export type TournamentMatchTYPE = {
	player: string;
	opponent: string;
	finished: boolean;
};
export type TournamentPlayerTYPE = {
	username: string;
	level: number;
};
interface ClientTournamentProps {
	gid: string;
	name: string;
	date: string;
	round: number;
	emptySlots: number;
	registered: boolean;
	state: TournamentStateTYPE;
	results: TournamentPlayerTYPE[];
	nextMatches: TournamentMatchTYPE[];
}
export class ClientTournament {
	public gid: string;
	public date: string;
	public name: string;
	public round: number;
	public emptySlots: number;
	public registered: boolean;
	public state: TournamentStateTYPE;
	public results: TournamentPlayerTYPE[];
	public nextMatches: TournamentMatchTYPE[];
	constructor({ name, date, emptySlots, state, results, registered, nextMatches, round, gid }: ClientTournamentProps) {
		this.nextMatches = nextMatches;
		this.registered = registered;
		this.emptySlots = emptySlots;
		this.results = results;
		this.state = state;
		this.round = round;
		this.date = date;
		this.name = name;
		this.gid = gid;
	}
	static instance = new ClientTournament({
		name: '',
		date: '',
		emptySlots: 0,
		registered: false,
		state: 'not open',
		results: [],
		nextMatches: [],
		round: 0,
		gid: '',
	});
}

// ! res --------------------------------------------------------------------------------

// * Pool

export class Register {
	alias: string;
	constructor(alias: string) {
		this.alias = alias;
	}
	public static instance = new Register('');
}

export class Engage {
	gid: string;
	constructor(gid: string) {
		this.gid = gid;
	}
	public static instance = new Engage('');
}

export class Invite {
	recipient: string;
	constructor(recipient: string) {
		this.recipient = recipient;
	}
	public static instance = new Invite('');
}

// * Game
export class Hook {
	gid: string;
	up: boolean;
	down: boolean;
	constructor(gid: string, up: boolean, down: boolean) {
		this.up = up;
		this.gid = gid;
		this.down = down;
	}
	public static instance = new Hook('', false, false);
}

export class Flip {
	gid: string;
	pos: number;
	constructor(gid: string, pos: number) {
		this.gid = gid;
		this.pos = pos;
	}
	public static instance = new Flip('', 0);
}

// ! req --------------------------------------------------------------------------------

// * Pool

export class Play {
	public gid: string;
	constructor(gid: string) {
		this.gid = gid;
	}
	static instance = new Play('');
}

export class Pool {
	public pool: ClientPlayer[];
	constructor(pool: ClientPlayer[]) {
		this.pool = pool;
	}
	static instance = new Pool([]);
}

export class Invitations {
	public invitations: ClientInvitation[];
	constructor(invitations: ClientInvitation[]) {
		this.invitations = invitations;
	}
	static instance = new Invitations([]);
}

// * Game

export class ClientPong {
	public start: boolean = false;
	public stop: boolean = false;
	public lost: boolean = false;
	public won: boolean = false;
	public sound: number = 0;
	public playerScore: number = 0;
	public opponentScore: number = 0;
	public ballX: number = 0;
	public ballY: number = 0;
	public ballRadius: number = 0;
	public paddleRadius: number = 0;
	public rightPaddlePosX: number = 0;
	public rightPaddlePosY: number = 0;
	public paddleHeight: number = 0;

	public leftPaddlePosX: number = 0;
	public leftPaddlePosY: number = 0;
	constructor() {}
	public static instance = new ClientPong();
}

export class ClientCardOfDoom {
	public cards: string[] = [];
	public myturn: boolean = false;
	public start: boolean = false;
	public stop: boolean = false;
	public lost: boolean = false;
	public won: boolean = false;
	public timer: number = 0;
	constructor() {}
	public static instance = new ClientCardOfDoom();
}
