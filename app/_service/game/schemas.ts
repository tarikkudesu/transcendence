export interface PongHistoryEntry {
	user_id: number;
	player_username: string;
	player_avatar_url: string;
	opponent_username: string;
	opponent_avatar_url: string;
	player_score: number;
	opponent_score: number;
	game_date: string;
}

export interface DoomHistoryEntry {
	user_id: number;
	player_username: string;
	player_avatar_url: string;
	opponent_username: string;
	opponent_avatar_url: string;
	winner_username: string;
	game_date: string;
}

export interface LeaderboardEntry {
	id: number;
	username: string;
	avatar_url: string;
	winns: number;
}

export interface PongSummary {
	total_games: number;
	total_winns: number;
	totalTournamentPlayed: number;
	totalTournamentWinns: number;
}

export interface DoomSummary {
	total_games: number;
	total_winns: number;
}

export interface TournamentContestant {
	username: string;
	avatar_url: string;
	round_level: number;
}

export interface TournamentMatch {
	user: string;
	opponent: string;
	player_score: number;
	opponent_score: number;
	date: string;
}

export interface TournamentDetailsType {
	Name: string;
	Date: string;
	Winner_username: string;
	Contestants: TournamentContestant[];
	matches: TournamentMatch[];
}

export interface TournamentHistoryEntry {
	tournament_name: string;
	tournament_date: string;
	winner_id: number;
}
