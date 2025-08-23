import { FriendActionResponse } from '@/app/_service/friends/schema';
import { useMutate } from '@/app/_service/useFetcher';
import { useCallback, useEffect, useState } from 'react';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

export default function useAddFriend() {
	const { data, isLoading, fetchData } = useMutate<FriendActionResponse>();
	const [unMount, setUnmount] = useState<boolean>(false);
	const call = useCallback(
		(username: string) => {
			fetchData({ url: `${API_BASE}/friends/add`, method: 'POST', body: { to: username } });
		},
		[fetchData]
	);
	useEffect(() => {
		if (data) setUnmount(true);
	}, [data]);
	return {call, unMount, isLoading};
}
