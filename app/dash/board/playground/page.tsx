import OnlinePlayers from '@/app/_components/dash/game/OnlinePlayers';
import ReceivedInvitations from '@/app/_components/dash/game/ReceivedInvitations';
import React from 'react';

const Playground: React.FC<unknown> = () => {
	return (
		<div className="relative">
			<ReceivedInvitations />
			<OnlinePlayers />
		</div>
	);
};

export default Playground;
