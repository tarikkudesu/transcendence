import { CheckResponse, FriendRequest } from '@/app/_service/friends/schema';
import { useMutate } from '@/app/_service/useFetcher';
import { useCallback, useEffect } from 'react';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

export function useFriendshipCheck(username: string) {
	const { data, fetchData } = useMutate<CheckResponse, FriendRequest>();
	const refresh = useCallback(() => {
		fetchData({ url: `${API_BASE}/friends/check`, method: 'POST', body: { to: username } });
	}, [username]);
	useEffect(() => {
		refresh();
	}, []);
	return { check: data ? data.state : 'none', refresh } as { check: 'accepted' | 'blocked' | 'pending' | 'none' | 'loading'; refresh: () => void };
}

export default useFriendshipCheck;
