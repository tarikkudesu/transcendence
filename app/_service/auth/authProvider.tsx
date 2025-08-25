'use client';

import { useCallback } from 'react';
import { useMutate } from '../useFetcher';
import { authContext } from './authContext';
import {
	ForgotPasswordRequest,
	LoginRequest,
	ResendOtpRequest,
	ResetPasswordRequest,
	SignupRequest,
	Verify2FARequest,
	VerifyAccountRequest,
} from './schema';

interface AuthProviderProps {
	children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { data, isLoading, error, fetchData, reset } = useMutate<
		| LoginRequest
		| SignupRequest
		| Verify2FARequest
		| ResendOtpRequest
		| ResetPasswordRequest
		| VerifyAccountRequest
		| ForgotPasswordRequest
		| undefined
	>();

	const refreshtokencall = useCallback(async () => {
		await fetchData({ url: '/auth/refresh', method: 'POST', body: undefined });
		console.log('requested a refresh token');
	}, [fetchData]);

	const logoutcall = useCallback(async () => {
		await fetchData({ url: '/auth/logout', method: 'POST', body: undefined });
	}, [fetchData]);

	const logincall = useCallback(
		async (data: LoginRequest) => {
			await fetchData({ url: '/auth/login', method: 'POST', body: data });
		},
		[fetchData]
	);
	const signupcall = useCallback(
		async (data: SignupRequest) => {
			await fetchData({ url: '/auth/signup', method: 'POST', body: data });
		},
		[fetchData]
	);
	const resendotp = useCallback(
		async (data: ResendOtpRequest) => {
			await fetchData({ url: '/auth/resend-code', method: 'POST', body: data });
		},
		[fetchData]
	);
	const twofacall = useCallback(
		async (data: Verify2FARequest) => {
			await fetchData({ url: '/auth/verify-2fa', method: 'POST', body: data });
		},
		[fetchData]
	);
	const resetpasscall = useCallback(
		async (data: ResetPasswordRequest) => {
			await fetchData({ url: '/auth/reset-password', method: 'POST', body: data });
		},
		[fetchData]
	);
	const forgotpasscall = useCallback(
		async (data: ForgotPasswordRequest) => {
			await fetchData({ url: '/auth/forgot-password', method: 'POST', body: data });
		},
		[fetchData]
	);
	const verifyaccountcall = useCallback(
		async (data: VerifyAccountRequest) => {
			await fetchData({ url: '/auth/verify-user', method: 'POST', body: data });
		},
		[fetchData]
	);

	return (
		<authContext.Provider
			value={{
				data,
				error,
				reset,
				isLoading,
				logoutcall,
				logincall,
				signupcall,
				resendotp,
				twofacall,
				resetpasscall,
				forgotpasscall,
				refreshtokencall,
				verifyaccountcall,
			}}
		>
			{children}
		</authContext.Provider>
	);
};

export default AuthProvider;
