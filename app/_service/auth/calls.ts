// 'use client';

// import type {
// 	ForgotPasswordRequest,
// 	LoginRequest,
// 	ResendOtpRequest,
// 	ResetPasswordRequest,
// 	SignupRequest,
// 	Verify2FARequest,
// 	VerifyAccountRequest,
// } from './schema';

//

// export interface RequestResult {
// 	message: string;
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	result: any;
// }

// async function postRequest<T>(endpoint: string, body: T): Promise<RequestResult> {
// 	try {
// 		const res = await fetch(`${endpoint}`, {
// 			method: 'POST',
// 			credentials: 'include',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(body),
// 		});
// 		const json = await res.json();
// 		if (!res.ok) return { message: json.message ?? 'Please try again', result: undefined };
// 		return { message: 'success', result: json };
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	} catch (error: any) {
// 		return { message: error.message ?? 'Please try again', result: undefined };
// 	}
// }

// export async function signup(data: SignupRequest): Promise<RequestResult> {
// 	return postRequest('/auth/signup', data);
// }

// export async function verifyAccount(data: VerifyAccountRequest): Promise<RequestResult> {
// 	return postRequest('/auth/verify-user', data);
// }

// export async function forgotPassword(data: ForgotPasswordRequest): Promise<RequestResult> {
// 	return postRequest('/auth/forgot-password', data);
// }

// export async function resetPassword(data: ResetPasswordRequest): Promise<RequestResult> {
// 	return postRequest('/auth/reset-password', data);
// }

// export async function login(data: LoginRequest): Promise<RequestResult> {
// 	return postRequest('/auth/login', data);
// }

// export async function verify2FA(data: Verify2FARequest): Promise<RequestResult> {
// 	return postRequest('/auth/verify-2fa', data);
// }

// export async function resendOtp(data: ResendOtpRequest): Promise<RequestResult> {
// 	return postRequest('/auth/resend-code', data);
// }

// export async function logout(): Promise<RequestResult> {
// 	return postRequest('/auth/logout', {});
// }
