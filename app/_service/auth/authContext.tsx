import { createContext, useContext } from 'react';
import { PongError } from '../useFetcher';
import {
	ForgotPasswordRequest,
	LoginRequest,
	ResendOtpRequest,
	ResetPasswordRequest,
	SignupRequest,
	Verify2FARequest,
	VerifyAccountRequest,
} from './schema';
import { MutateResponse } from '../user/schema';

interface authState {
	reset: () => void;
	isLoading: boolean;
	error: PongError | null;
	data: MutateResponse | null;
	logoutcall: () => void;
	refreshtokencall: () => void;
	logincall: (data: LoginRequest) => void;
	signupcall: (data: SignupRequest) => void;
	resendotp: (data: ResendOtpRequest) => void;
	twofacall: (data: Verify2FARequest) => void;
	resetpasscall: (data: ResetPasswordRequest) => void;
	forgotpasscall: (data: ForgotPasswordRequest) => void;
	verifyaccountcall: (data: VerifyAccountRequest) => void;
}

export const AuthInitialState = {
	data: null,
	error: null,
	isLoading: false,
	reset: () => confirm,
	logoutcall: () => {},
	refreshtokencall: () => {},
	logincall: (data: LoginRequest) => {},
	signupcall: (data: SignupRequest) => {},
	resendotp: (data: ResendOtpRequest) => {},
	twofacall: (data: Verify2FARequest) => {},
	resetpasscall: (data: ResetPasswordRequest) => {},
	forgotpasscall: (data: ForgotPasswordRequest) => {},
	verifyaccountcall: (data: VerifyAccountRequest) => {},
};

export const authContext = createContext<authState>(AuthInitialState);

export function useAuth() {
	return useContext(authContext);
}
