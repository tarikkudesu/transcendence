import type { Metadata } from 'next';

export const auth: string[] = ['/2fa-authentication', '/forgot-password', '/reset-password', '/verify-account', '/signup', '/login'];

export const visitable = [
	'/',
	'/chat',
	'/local',
	'/leaderboard',
	'/playground',
	'/tournament',
	'/doomleaderboard',
	'/pongleaderboard',
	'/tournaments',
];

export const baseMetadata: Metadata = {
	metadataBase: new URL('http://localhost'),
	title: {
		template: '%s | YibgYangPong GameArena',
		default: 'YibgYangPong GameArena',
	},
	applicationName: 'YibgYangPong',
	description:
		'YibgYangPong, The ultimate gaming platform for competitive ping pong and doom cards. Join tournaments, climb leaderboards, and challenge players worldwide.',
	keywords: ['YingYangPong', 'ping pong', 'doom cards', 'online gaming', 'tournaments', 'leaderboard', 'multiplayer games'],
	authors: [{ name: 'Amehri Tarik' }, { name: 'Otman Oulcaid' }, { name: 'El Mustapha Zahiri' }],
	creator: 'Amehri Tarik',
	publisher: 'Amehri Tarik',
};

export const authMetadata = {
	login: {
		title: 'Login',
		description: 'Sign In to YingYangPong',
	},
	signup: {
		title: 'Sign Up',
		description: 'Create a YingYangPong account',
	},

	forgotPassword: {
		title: 'Forgot Password',
		description: 'Reset your YingYangPong account password to regain access to your gaming profile.',
	},

	resetPassword: {
		title: 'Reset Password',
		description: 'Set a new password for your YingYangPong account.',
	},

	twoFactorAuth: {
		title: '2FA Verification',
		description: 'Complete two-factor authentication to secure your YingYangPong account.',
	},

	verifyAccount: {
		title: 'Verify Account',
		description: 'Verify your email address to activate your YingYangPong account.',
	},
	addBio: {
		title: 'Add Bio',
		description: 'Tell other players about yourself and your gaming style.',
	},
	addProfilePicture: {
		title: 'Add Profile Picture',
		description: 'Upload a profile picture to personalize your YingYangPong account.',
	},
};

export const mainAppMetadata = {
	dashboard: {
		title: 'Dashboard',
		description: `View your gaming options and update your account settings..`,
	},
	profile: (profileName: string) => ({
		title: profileName,
		description: `View ${profileName}'s gaming stats and match history on YingYangPong.`,
	}),
	chat: {
		title: 'Chat',
		description: 'Connect with other players and make gaming friends.',
	},

	playground: {
		title: 'Playground',
		description: 'View currently online players, invite them to play a ping pong match, or a doom cards match.',
	},

	localGameplay: {
		title: 'Local Gameplay',
		description: 'Play ping pong with your friends in real life',
	},

	pongGameplay: (opponent: string) => ({
		title: `Ping Pong vs ${opponent}`,
		description: `Live ping pong match against ${opponent}. Watch the action unfold!`,
	}),

	doomGameplay: (opponent?: string) => ({
		title: `Doom Cards vs ${opponent}`,
		description: `Strategic doom cards battle against ${opponent}. May the best strategist win!`,
	}),

	leaderboard: {
		title: 'Leaderboard',
		description: 'Check the top players in ping pong and doom cards. Climb the ranks and prove your skills!',
	},

	pongLeaderboard: {
		title: 'Ping Pong Leaderboard',
		description: 'Top ping pong players ranked by skill, wins, and tournament performance.',
	},

	doomLeaderboard: {
		title: 'Doom Cards Leaderboard',
		description: 'Elite doom cards players ranked by strategic prowess and tournament victories.',
	},

	tournaments: {
		title: 'Tournaments',
		description: 'See Full tournament history.',
	},

	tournament: {
		title: 'Tournament',
		description: 'Join exciting ping pong tournaments. Compete for glory and climb the leaderboard.',
	},

	specificTournament: (tournamentName: string) => ({
		title: `${tournamentName} Tournament`,
		description: `Join the ${tournamentName} tournament. See match history, And inpect each player's round level.`,
	}),

	pongHistory: (profileName: string) => ({
		title: `${profileName}'s Ping Pong History`,
		description: `Complete ping pong match history and statistics for ${profileName}.`,
	}),

	doomHistory: (profileName?: string) => ({
		title: `${profileName}'s Doom Cards History`,
		description: `Comprehensive doom cards match history and strategic analysis for ${profileName}.`,
	}),
};
