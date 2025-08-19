'use client';

import { FriendActionResponse, FriendRequest } from '@/app/_service/friends/schema';
import { useMutate } from '@/app/_service/useFetcher';
import Link from 'next/link';
import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNotification } from '../../useNotify';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

export const AcceptButton: React.FC<{ username: string; refresh?: () => void }> = ({ username, refresh }) => {
	const { isLoading, error, fetchData } = useMutate<FriendActionResponse, FriendRequest>();

	const acceptCall = useCallback(() => {
		toast.promise(fetchData({ url: `${API_BASE}/friends/accept`, method: 'PUT', body: { to: username }, refresh }), {
			success: 'Invitation Accepted',
			loading: 'Loading...',
			error: error,
		});
	}, [fetchData, username]);

	return (
		<button
			disabled={isLoading}
			onClick={acceptCall}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-accent-300 cursor-pointer duration-150"
		>
			Accept
		</button>
	);
};

export const AddButton: React.FC<{ username: string; refresh?: () => void }> = ({ username, refresh }) => {
	const { isLoading, error, fetchData } = useMutate<FriendActionResponse, FriendRequest>();

	const addCall = useCallback(() => {
		toast.promise(fetchData({ url: `${API_BASE}/friends/add`, method: 'POST', body: { to: username }, refresh }), {
			success: 'Invitation Sent',
			loading: 'Loading...',
			error: error,
		});
	}, [fetchData, username]);

	return (
		<button
			disabled={isLoading}
			onClick={addCall}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-accent-300 cursor-pointer duration-150"
		>
			Add Friend
		</button>
	);
};

export const DeclineButton: React.FC<{ username: string; refresh?: () => void }> = ({ username, refresh }) => {
	const { isLoading, error, fetchData } = useMutate<FriendActionResponse, FriendRequest>();

	const declineCall = useCallback(() => {
		toast.promise(fetchData({ url: `${API_BASE}/friends/remove`, method: 'DELETE', body: { to: username }, refresh }), {
			success: 'Invitation Rejected',
			loading: 'Loading...',
			error: error,
		});
	}, [fetchData, username]);

	return (
		<button
			disabled={isLoading}
			onClick={declineCall}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-white hover:bg-red-600 cursor-pointer duration-150"
		>
			Decline
		</button>
	);
};

export const BlockButton: React.FC<{ username: string; refresh?: () => void }> = ({ username, refresh }) => {
	const { isLoading, error, fetchData } = useMutate<FriendActionResponse, FriendRequest>();

	const blockCall = useCallback(() => {
		toast.promise(fetchData({ url: `${API_BASE}/friends/block`, method: 'PUT', body: { to: username }, refresh }), {
			success: 'User Blocked',
			loading: 'Loading...',
			error: error,
		});
	}, [fetchData, username]);

	return (
		<button
			disabled={isLoading}
			onClick={blockCall}
			className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-white hover:bg-red-600 cursor-pointer duration-150"
		>
			Block
		</button>
	);
};

export const ChatButton: React.FC<{ username: string }> = ({ username }) => {
	return (
		<Link href="">
			<button className="font-bold w-full rounded-sm text-sm pt-2 pb-1.5 px-4 bg-dark-900 text-dark-200 hover:text-black hover:bg-accent-300 cursor-pointer duration-150">
				Chat
			</button>
		</Link>
	);
};
