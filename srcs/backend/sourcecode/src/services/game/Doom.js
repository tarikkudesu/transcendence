import { cardsNum, timeLimite, randInt } from './index.js';
export class Doom {
    constructor(player, opponent) {
        this._winner = '';
        this._BomPos = 0;
        this._myturn = player;
        this._player = player;
        this._timer = Date.now();
        this._opponent = opponent;
        this._BomPos = randInt(0, cardsNum);
        this._table = Array(cardsNum).fill('C');
    }
    flip(username, pos) {
        if ((username !== this._player && username !== this._opponent) ||
            (username === this._player && this._myturn !== this._player) ||
            (username === this._opponent && this._myturn !== this._opponent))
            return;
        if (pos < 0 || pos >= cardsNum)
            return;
        if (this._myturn === this._player)
            this._myturn = this._opponent;
        else
            this._myturn = this._player;
        if (pos === this._BomPos)
            this._table[pos] = 'B';
        else
            this._table[pos] = 'D';
        this._timer = Date.now();
        if (this._table[pos] === 'B' && username === this._player)
            this._winner = this._opponent;
        else if (this._table[pos] === 'B' && username === this._opponent)
            this._winner = this._player;
    }
    getMap() {
        return this._table;
    }
    update() {
        if (this._winner !== '')
            return true;
        if (Date.now() - this._timer > timeLimite && this._myturn === this._player) {
            this._myturn = this._opponent;
            this._timer = Date.now();
        }
        else if (Date.now() - this._timer > timeLimite && this._myturn === this._opponent) {
            this._myturn = this._player;
            this._timer = Date.now();
        }
        return false;
    }
    get timer() {
        return this._timer;
    }
    get myturn() {
        return this._myturn;
    }
    get winner() {
        return this._winner;
    }
}
