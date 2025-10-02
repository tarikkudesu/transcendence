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
	public playerStatus: 'free' | 'doom' | 'pong';
	public inviteStatus: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(
		username: string,
		game: 'pong' | 'card of doom',
		playerStatus: 'free' | 'doom' | 'pong',
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

export type TournamentStateTYPE = 'not registered' | 'open' | 'playing' | 'finished';

export type TournamentMatchTYPE = {
	player: string;
	opponent: string;
	playerAlias: string;
	opponentAlias: string;
	finished: boolean;
};
export type TournamentPlayerTYPE = {
	username: string;
	alias: string;
	level: number;
};
interface ClientTournamentProps {
	gid: string;
	name: string;
	date: string;
	round: number;
	emptySlots: number;
	registered: boolean;
	restriction: string;
	state: TournamentStateTYPE;
	results: TournamentPlayerTYPE[];
	nextMatches: TournamentMatchTYPE[];
}

export class TournamentOverview {
	name: string;
	date: string;
	state: string;
	creator: string;
	constructor({ name, date, state, creator }: { name: string; date: string; state: string; creator: string }) {
		this.name = name;
		this.date = date;
		this.state = state;
		this.creator = creator;
	}
	static instance: TournamentOverview = new TournamentOverview({
		name: '',
		date: '',
		state: '',
		creator: '',
	});
}

export class ClientTournament {
	public gid: string;
	public date: string;
	public name: string;
	public round: number;
	public emptySlots: number;
	public registered: boolean;
	public restriction: string;
	public state: TournamentStateTYPE;
	public results: TournamentPlayerTYPE[];
	public nextMatches: TournamentMatchTYPE[];
	constructor({ name, date, emptySlots, state, results, registered, nextMatches, round, gid, restriction }: ClientTournamentProps) {
		this.nextMatches = nextMatches;
		this.restriction = restriction;
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
		restriction: '',
		registered: false,
		state: 'not registered',
		nextMatches: [],
		results: [],
		round: 0,
		gid: '',
	});
}

// ! res --------------------------------------------------------------------------------

// * Pool

export class Register {
	alias: string;
	creator: string;
	constructor(alias: string, creator: string) {
		this.creator = creator;
		this.alias = alias;
	}
	public static instance = new Register('', '');
}
export class Create {
	alias: string;
	name: string;
	max: number;
	constructor(name: string, max: number, alias: string) {
		this.alias = alias;
		this.name = name;
		this.max = max;
	}
	public static instance = new Create('', 0, '');
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
	public opponent: string;
	constructor(gid: string, opponent: string) {
		this.opponent = opponent;
		this.gid = gid;
	}
	static instance = new Play('', '');
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
export class Tournaments {
	public tournaments: TournamentOverview[];
	constructor(tournaments: TournamentOverview[]) {
		this.tournaments = tournaments;
	}
	static instance = new Tournaments([]);
}

// * Game

export class ClientPong {
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
	public myturn: boolean = false;
	public cards: string[] = [];
	public timer: number = 0;
	constructor() {}
	public static instance = new ClientCardOfDoom();
}
