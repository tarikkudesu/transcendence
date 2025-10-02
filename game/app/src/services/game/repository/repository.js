

class Repository {
    constructor() {
        this.invitations = new Map();
        this.tournaments = new Map();
        this.players = new Map();
        this.pongs = new Map();
        this.dooms = new Map();
        this.rooms = new Map();
    }
}

export const repository = new Repository();
