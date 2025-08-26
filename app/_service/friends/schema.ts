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
