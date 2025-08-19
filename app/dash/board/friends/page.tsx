import FriendRequests from '@/app/_components/dash/friends/FriendRequests';
import FriendsList from '@/app/_components/dash/friends/FriendsList';
import React from 'react';

const Friends: React.FC<unknown> = () => {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<FriendRequests />
			<FriendsList />
		</div>
	);
};

export default Friends;
