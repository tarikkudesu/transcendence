'use client';

import axios from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const client = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// axiosRetry(axios, {
// 	retries: 3,
// 	retryDelay(retryCount) {
// 		console.log(`retry attempt ${retryCount}`);
// 		return 1000;
// 	},
// 	retryCondition(error) {
// 		console.log(error.response?.status, 'retry condition');
// 		return error.response?.status === 401;
// 	},
// });

client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401) {
			try {
				await client.post('/auth/refresh');
				console.log('refreshing token success');
				return client(originalRequest);
			} catch (refreshError) {
				console.log('refreshing token failed', refreshError);
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		} else return Promise.reject(error);
	}
);

export default client;
