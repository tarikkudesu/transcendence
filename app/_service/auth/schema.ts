
export interface SignupRequest {
	username: string;
	password: string;
	email: string;
}

export interface VerifyAccountRequest {
	verificationCode: string;
	email: string;
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
	email: string;
}

export interface ResendOtpRequest {
	email: string;
}
