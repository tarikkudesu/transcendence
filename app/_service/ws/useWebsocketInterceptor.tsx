import { AxiosError } from 'axios';
import { useCallback } from 'react';
import client from '../axios/client';

export function useWebsocketInterceptor() {
	const refresh = useCallback(async () => {
		return new Promise(async (resolve, reject) => {
			try {
				await client.post('/auth/refresh');
				console.log('refreshing token success websocket');
				resolve('success');
			} catch (refreshError) {
				console.log('refreshing token failed websocket', refreshError);
				reject('failed');
			}
		});
	}, []);
	const intercept = useCallback(async () => {
		return new Promise(async (resolve, reject) => {
			try {
				await client.get('/users/me');
				resolve('success');
			} catch (err) {
				if (err instanceof AxiosError && err.response?.status === 401) {
					return refresh();
				} else {
					reject('failed');
				}
			}
		});
	}, [refresh]);
	return { intercept };
}
