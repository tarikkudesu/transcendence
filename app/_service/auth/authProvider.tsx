'use client';

import { useCallback } from 'react';
import { useMutate } from '../useFetcher';
import { UpdateAvatarRequest, UpdateBioRequest, UpdatePasswordRequest, UpdateUsernameRequest } from '../user/schema';
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
		| UpdatePasswordRequest
		| UpdateUsernameRequest
		| UpdateAvatarRequest
		| UpdateBioRequest
		| undefined
	>();

	const logoutcall = useCallback(async () => {
		reset();
		await fetchData({ url: '/auth/logout', method: 'POST', body: undefined });
	}, [fetchData, reset]);

	const logincall = useCallback(
		async (data: LoginRequest) => {
			reset();
			await fetchData({ url: '/auth/login', method: 'POST', body: data });
		},
		[fetchData, reset]
	);
	const signupcall = useCallback(
		async (body: SignupRequest) => {
			reset();
			await fetchData({ url: '/auth/signup', method: 'POST', body });
		},
		[fetchData, reset]
	);
	const resendotp = useCallback(
		async (body: ResendOtpRequest) => {
			reset();
			await fetchData({ url: '/auth/resend-code', method: 'POST', body });
		},
		[fetchData, reset]
	);
	const twofacall = useCallback(
		async (body: Verify2FARequest) => {
			reset();
			await fetchData({ url: '/auth/verify-2fa', method: 'POST', body });
		},
		[fetchData, reset]
	);
	const resetpasscall = useCallback(
		async (body: ResetPasswordRequest) => {
			reset();
			await fetchData({ url: '/auth/reset-password', method: 'POST', body });
		},
		[fetchData, reset]
	);
	const forgotpasscall = useCallback(
		async (body: ForgotPasswordRequest) => {
			reset();
			await fetchData({ url: '/auth/forgot-password', method: 'POST', body });
		},
		[fetchData, reset]
	);
	const verifyaccountcall = useCallback(
		async (body: VerifyAccountRequest) => {
			reset();
			await fetchData({ url: '/auth/verify-user', method: 'POST', body });
		},
		[fetchData, reset]
	);

	const deleteaccountcall = useCallback(async () => {
		reset();
		await fetchData({ url: '/users/delete', method: 'DELETE', body: undefined });
	}, [fetchData]);

	const updatepasscall = useCallback(
		async (body: UpdatePasswordRequest) => {
			reset();
			await fetchData({ url: '/users/profile/password', method: 'PUT', body });
		},
		[fetchData, reset]
	);
	const updateusernamecall = useCallback(
		async (body: UpdateUsernameRequest) => {
			reset();
			await fetchData({ url: '/users/profile/username', method: 'PUT', body });
		},
		[fetchData, reset]
	);
	const updatebiocall = useCallback(
		async (body: UpdateBioRequest) => {
			reset();
			await fetchData({ url: '/users/profile/bio', method: 'PUT', body });
		},
		[fetchData, reset]
	);
	const updateavatarcall = useCallback(
		async (body: UpdateAvatarRequest) => {
			reset();
			await fetchData({ url: '/users/profile/avatar', method: 'PUT', body });
		},
		[fetchData, reset]
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
				deleteaccountcall,
				verifyaccountcall,
				updatepasscall,
				updateusernamecall,
				updatebiocall,
				updateavatarcall,
			}}
		>
			{children}
		</authContext.Provider>
	);
};

export default AuthProvider;
