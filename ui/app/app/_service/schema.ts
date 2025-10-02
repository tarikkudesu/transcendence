export interface SignupRequest {
	username: string;
	password: string;
	email: string;
}
export interface VerifyAccountRequest {
	verificationCode: string;
}
export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	newPassword: string;
	repeatNewPassword: string;
	token: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface Verify2FARequest {
	verificationCode: string;
}

export interface FriendSearch {
	avatar_url: string;
	username: string;
}

export interface BlockedFriend {
	avatar_url: string;
	username: string;
	stat: string;
}

export interface Friend {
	avatar_url: string;
	username: string;
	stat: string;
	bio: string;
}

export interface FriendRequest {
	avatar_url: string;
	username: string;
	stat: string;
}
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
	alias: string;
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
export interface MutateResponse {
	success: boolean;
	message: string;
	email?: string;
	path?: string;
}

export interface UpdatePasswordRequest {
	newpassword: string;
}

export interface UpdateUsernameRequest {
	newusername: string;
}

export interface UpdateBioRequest {
	bio: string;
}

export interface UpdateAvatarRequest {
	avatar: File;
}

export interface UserProfile {
	created_at: string;
	active?: boolean;
	username: string;
	avatar: string;
	email: string;
	bio: string;
}
export interface PongError {
	error: string;
	message: string;
	statusCode: number;
}
export class Message {
	message: string = '';
	sender: string = '';
	receiver: string = '';
	date: string = '';
}

export class OuterMessage {
	friend: string = '';
	avatar: string = '';
	lastMessage: Message = new Message();
}
