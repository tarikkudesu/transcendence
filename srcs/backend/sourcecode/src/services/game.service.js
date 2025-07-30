import AppError from '../utils/AppError.js';
import { mdb, main, useParser, ErrorMessage, Message, Json } from './game/index.js';

class GameService {
    constructor(userRepo, gameRepo, playerRepo, tournamentRepo)
    {
        this.users = userRepo;
        this.games = gameRepo;
        this.contestants = playerRepo;
        this.tournaments = tournamentRepo;
        main(this.createGamePong.bind(this), this.createTournament.bind(this), this.addPlayerToTournament.bind(this));
    }

    async createGamePong({ userUsername, opponentUsername, userScore, opponentScore, gameDate })
    {
        const user = this.users.findUserByUsername(userUsername);
        const opponent = this.users.findUserByUsername(opponentUsername);
        if (!user || !opponent) return { success: false };
        this.games.addGamePong(user.id, opponent.id, userScore, opponentScore, gameDate);
        return { success: true };
    }

    async createGameDoom({ userUsername, opponentUsername, userScore, opponentScore, gameDate })
    {
        const user = this.users.findUserByUsername(userUsername);
        const opponent = this.users.findUserByUsername(opponentUsername);
        if (!user || !opponent) return { success: false };
        this.games.addGameDoom(user.id, opponent.id, userScore, opponentScore, gameDate);
        return { success: true };
    }

    async createTournament({ tournamentName, tournamentDate, winnerId })
    {
        this.tournaments.createTournament(tournamentName, tournamentDate, winnerId);
        return { success: true };
    }

    async addPlayerToTournament({ username, tournamentName, roundLevel })
    {
        const user = this.users.findUserByUsername(username);
        const tournament = this.tournaments.findTournamentByName(tournamentName);
        if (!user || !tournament) return { success: false };
        this.contestants.addPlayer(user.id, tournament.id, roundLevel);
        return { success: true };
    }

    async getLeaderBoardPong()
    {
        const result = this.games.getLeaderBoardPong();
        return { success: true, leaderboard: result };
    }

    async getHistoryUserPong(username)
    {
        const user = this.users.findUserByUsername(username);
        if (!user)
            throw new AppError('this user not found', 404);
        const history = this.games.getHistoryUserPong(user.id);
        return { success: true, history: history };
    }

    async getUserPongSummary(username)
    {
        const user = this.users.findUserByUsername(username);
        if (!user)
            throw new AppError('this user not found', 404);
        const stats =
        {
            total_games: this.games.getTotalPongGamesById(user.id),
            total_winns: this.games.getTotalWinsPongById(user.id),
            totalTournamentPlayed: this.contestants.getTotalTournamentsPlayed(user.id),
            totalTournamentWinns: this.tournaments.getTotalTournamentsWinns(user.id),
        }
        return { success: true, stats: stats };
    }

    async getUserDoomSummary(username)
    {
        const user = this.users.findUserByUsername(username);
        if (!user)
            throw new AppError('this user not found', 404);
        const stats =
        {
            total_games: this.games.getTotalGamesDoomById(user.id),
            total_winns: this.games.getTotalWinsDoomById(user.id),
        }
        return { success: true, stats: stats };
    }

    async getHistoryUserDoom(username)
    {
        const user = this.users.findUserByUsername(username);
        if (!user)
            throw new AppError('this user not found', 404);
        const history = this.games.getHistoryUserDoom(user.id);
        return { success: true, history: history };
    }

    async getLeaderBoardDoom()
    {
        const result = this.games.getLeaderBoardDoom();
        return { success: true, leaderboard: result };
    }

    async getTournamentsHistory()
    {
        const result = this.tournaments.getTournamentsHistory();
        return { success: true, leaderboard: result };
    }

    async getTournamentsStats(name)
    {
        const tournament = this.tournaments.findTournamentByName(name);
        if (!tournament)
            throw new AppError('this Tournament not found', 404);
        const user = this.users.getUserById(tournament.winner_id);
        const contestants = this.contestants.findAllContestants(tournament.id);
        const matches = this.contestants.findAllMatches(tournament.id);
        const stats =
        {
            Name: name,
            Date: tournament.tournament_date,
            Winner_username: user.username,
            Contestants: contestants,
            matches: matches,
        }
        return { success: true, stats: stats };

    }

    async closeSocket(socket)
    {
        if (socket.username)
        {
        if (socket.PLAYFREE === false)
            {
            try {
                const room = mdb.getRoom(socket.gid);
                room.roomState = 'disconnected';
                room.date_at = Date.now();
            } catch (err) { }
        }
        mdb.cancelAllPlayerInvitations(socket.username);
        mdb.removePlayer(socket.username);
        }
    }
    async eventEntry(message, socket)
    {
        try {
            const { username } = Json({ message, target: Message.instance });
            const user = this.users.findUserByUsername(username);
            if (!user) throw new Error('not registered');
            useParser(message, socket);
        } catch (error) {
            socket.send(ErrorMessage("you didn't pong good enough"));
            console.error('Error', error.message);
        }
    }
}

export default GameService;