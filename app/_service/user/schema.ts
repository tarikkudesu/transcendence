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
	username: string;
	email: string;
	bio: string;
	created_at: string;
	avatar: string;
}
