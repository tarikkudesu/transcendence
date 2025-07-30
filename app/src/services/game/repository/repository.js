import * as Main from '../index.js';
class Repository {
    constructor() {
        this.invitations = new Map();
        this.players = new Map();
        this.rooms = new Map();
        this.tournament = new Main.Tournament();
    }
}
export const repository = new Repository();
