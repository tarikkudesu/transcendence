import { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import client from '../axios/client';
import { PongError } from '../schema';
import { MutateResponse } from '../schema';
import { useFriends } from './FriendContext';

export function useAddFriendCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);
	const { refetch } = useFriends();

	const fetchData = useCallback(
		async (body: { to: string }) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<MutateResponse> = await client.post('/friends/add', body);
				setData(response.data);
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					setError({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					});
				} else {
					setError({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					});
				}
			} finally {
				refetch();
				setIsLoading(false);
			}
		},
		[refetch]
	);

	return { isLoading, error, data, addCall: fetchData };
}
export function useAcceptFriendCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);
	const { refetch } = useFriends();

	const fetchData = useCallback(
		async (body: { to: string }) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<MutateResponse> = await client.put('/friends/accept', body);
				setData(response.data);
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					setError({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					});
				} else {
					setError({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					});
				}
			} finally {
				refetch();
				setIsLoading(false);
			}
		},
		[refetch]
	);

	return { isLoading, error, data, acceptCall: fetchData };
}
export function useDeclineFriendCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);
	const { refetch } = useFriends();

	const fetchData = useCallback(
		async (body: { to: string }) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<MutateResponse> = await client.delete('/friends/remove', {
					data: body,
				});
				setData(response.data);
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					setError({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					});
				} else {
					setError({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					});
					refetch();
				}
			} finally {
				setIsLoading(false);
			}
		},
		[refetch]
	);

	return { isLoading, error, data, declineCall: fetchData };
}
export function useBlockFriendCall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<MutateResponse | null>(null);
	const { refetch } = useFriends();

	const fetchData = useCallback(
		async (body: { to: string }) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<MutateResponse> = await client.put('/friends/block', body);
				setData(response.data);
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					setError({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					});
				} else {
					setError({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					});
				}
			} finally {
				refetch();
				setIsLoading(false);
			}
		},
		[refetch]
	);

	return { isLoading, error, data, blockCall: fetchData };
}
