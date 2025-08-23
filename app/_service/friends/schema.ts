export interface FriendSearch {
	avatar_url: string;
	username: string;
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

export type FriendsResponse = Friend[];

export type FriendSearchResponse = Pick<Friend, 'username' | 'avatar_url'>[];


export interface FriendActionResponse {
	message: string;
}

export interface CheckResponse {
	state: 'pending' | 'blocked' | 'accepted';
}
