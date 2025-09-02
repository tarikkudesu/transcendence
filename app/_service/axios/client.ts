'use client';

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const client = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	timeout: 3000,
	headers: {
		'Content-Type': 'application/json',
	},
});

client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401) {
			try {
				await client.post('/auth/refresh');
				console.log('refreshing token success client');
				return client(originalRequest);
			} catch (refreshError) {
				console.log('refreshing token failed client', refreshError);
				return Promise.reject("could not refresh token");
			}
		} else return Promise.reject(error);
	}
);

export default client;
