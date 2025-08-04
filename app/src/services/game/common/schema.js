export class Message {
    constructor({ message, data, game }) {
        this.data = JSON.stringify(data);
        this.message = message;
        this.game = game;
    }
}
Message.instance = new Message({ message: '', data: {}, game: 'pong' });
export class WSError {
    constructor(error) {
        this.message = error;
    }
}
WSError.instance = new WSError('');
export class ClientPlayer {
    constructor(username, game, playerStatus, inviteStatus) {
        this.inviteStatus = inviteStatus;
        this.playerStatus = playerStatus;
        this.username = username;
        this.game = game;
    }
}
ClientPlayer.instance = new ClientPlayer('', 'pong', 'free', 'unsent');
export class ClientInvitation {
    constructor(sender, game, inviteStatus) {
        this.inviteStatus = inviteStatus;
        this.sender = sender;
        this.game = game;
    }
}
ClientInvitation.instance = new ClientInvitation('', 'pong', 'unsent');
export class ClientTournament {
    constructor({ name, date, emptySlots, state, results, registered, nextMatches, round, gid }) {
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
}
ClientTournament.instance = new ClientTournament({ name: '', date: '', emptySlots: 0, registered: false, state: 'not open', results: [], nextMatches: [], round: 0, gid: '' });
export class Play {
    constructor(gid) {
        this.gid = gid;
    }
}
Play.instance = new Play('');
export class Pool {
    constructor(pool) {
        this.pool = pool;
    }
}
Pool.instance = new Pool([]);
export class Invitations {
    constructor(invitations) {
        this.invitations = invitations;
    }
}
Invitations.instance = new Invitations([]);
export class ClientPong {
    constructor({ playerScore, opponentScore, ball, rightPaddle, leftPaddle, start, stop, won, lost, tinychat, sound }) {
        this.start = start;
        this.stop = stop;
        this.lost = lost;
        this.won = won;
        this.sound = sound;
        this.tinychat = tinychat;
        this.playerScore = playerScore;
        this.opponentScore = opponentScore;
        this.ballX = Math.ceil(ball.pos.x);
        this.ballY = Math.ceil(ball.pos.y);
        this.ballRadius = Math.ceil(ball.radius);
        this.paddleRadius = Math.ceil(rightPaddle.radius);
        this.rightPaddlePosX = Math.ceil(rightPaddle.pos.x);
        this.rightPaddlePosY = Math.ceil(rightPaddle.pos.y);
        this.leftPaddlePosX = Math.ceil(leftPaddle.pos.x);
        this.leftPaddlePosY = Math.ceil(leftPaddle.pos.y);
        this.paddleHeight = Math.ceil(rightPaddle.length);
    }
}
export class ClientCardOfDoom {
    constructor({ cards, myturn, timer, start, stop, lost, won, tinychat }) {
        this.tinychat = tinychat;
        this.myturn = myturn;
        this.timer = timer;
        this.start = start;
        this.cards = cards;
        this.stop = stop;
        this.lost = lost;
        this.won = won;
    }
}
// ! req -------------------------------------------------------------------------
// * Pool
export class Register {
    constructor(alias) {
        this.alias = alias;
    }
}
Register.instance = new Register('');
export class Engage {
    constructor(gid) {
        this.gid = gid;
    }
}
Engage.instance = new Engage('');
export class Invite {
    constructor(recipient) {
        this.recipient = recipient;
    }
}
Invite.instance = new Invite('');
export class TinyChat {
    constructor(message, gid) {
        this.message = message;
        this.gid = gid;
    }
}
TinyChat.instance = new TinyChat('', '');
// * Game
export class Hook {
    constructor(gid, up, down) {
        this.up = up;
        this.gid = gid;
        this.down = down;
    }
}
Hook.instance = new Hook('', false, false);
export class Flip {
    constructor(gid, pos) {
        this.gid = gid;
        this.pos = pos;
    }
}
Flip.instance = new Flip('', 0);
