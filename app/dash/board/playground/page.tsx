import OnlinePlayers from '@/app/_components/dash/game/OnlinePlayers';
import ReceivedInvitations from '@/app/_components/dash/game/ReceivedInvitations';
import React from 'react';

const Playground: React.FC<unknown> = () => {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<ReceivedInvitations />
			<OnlinePlayers />
		</div>
	);
};

export default Playground;
