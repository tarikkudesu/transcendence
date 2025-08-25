export interface MutateResponse {
	success: boolean;
	message: string;
	email?: string;
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
	username: string;
	avatar: string;
	email: string;
	bio: string;
}