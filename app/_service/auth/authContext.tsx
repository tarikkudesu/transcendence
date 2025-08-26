import { createContext, useContext } from 'react';
import { PongError } from '../useFetcher';
import { MutateResponse, UpdateAvatarRequest, UpdateBioRequest, UpdatePasswordRequest, UpdateUsernameRequest } from '../user/schema';
import {
	ForgotPasswordRequest,
	LoginRequest,
	ResendOtpRequest,
	ResetPasswordRequest,
	SignupRequest,
	Verify2FARequest,
	VerifyAccountRequest,
} from './schema';

interface authState {
	reset: () => void;
	isLoading: boolean;
	error: PongError | null;
	data: MutateResponse | null;
	logoutcall: () => void;
	deleteaccountcall: () => void;
	logincall: (body: LoginRequest) => void;
	signupcall: (body: SignupRequest) => void;
	resendotp: (body: ResendOtpRequest) => void;
	twofacall: (body: Verify2FARequest) => void;
	resetpasscall: (body: ResetPasswordRequest) => void;
	forgotpasscall: (body: ForgotPasswordRequest) => void;
	verifyaccountcall: (body: VerifyAccountRequest) => void;
	updatepasscall: (body: UpdatePasswordRequest) => void;
	updateusernamecall: (body: UpdateUsernameRequest) => void;
	updatebiocall: (body: UpdateBioRequest) => void;
	updateavatarcall: (body: UpdateAvatarRequest) => void;
}

export const AuthInitialState = {
	data: null,
	error: null,
	isLoading: false,
	reset: () => confirm,
	logoutcall: () => {},
	deleteaccountcall: () => {},
	logincall: (body: LoginRequest) => {},
	signupcall: (body: SignupRequest) => {},
	resendotp: (body: ResendOtpRequest) => {},
	twofacall: (body: Verify2FARequest) => {},
	resetpasscall: (body: ResetPasswordRequest) => {},
	forgotpasscall: (body: ForgotPasswordRequest) => {},
	verifyaccountcall: (body: VerifyAccountRequest) => {},
	updatepasscall: (body: UpdatePasswordRequest) => {},
	updateusernamecall: (body: UpdateUsernameRequest) => {},
	updatebiocall: (body: UpdateBioRequest) => {},
	updateavatarcall: (body: UpdateAvatarRequest) => {},
};

export const authContext = createContext<authState>(AuthInitialState);

export function useAuth() {
	return useContext(authContext);
}
