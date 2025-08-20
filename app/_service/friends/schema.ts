export interface FriendSearch {
	username: string;
	avatar_url: string;
}

export interface Friend {
	username: string;
	avatar_url: string;
	stat: string;
}

export type FriendsResponse = Friend[];

export type FriendSearchResponse = Pick<Friend, 'username' | 'avatar_url'>[];

export interface FriendRequest {
	to: string;
}

export interface FriendActionResponse {
	message: string;
}

export interface CheckResponse {
	state: 'pending' | 'blocked' | 'accepted';
}
