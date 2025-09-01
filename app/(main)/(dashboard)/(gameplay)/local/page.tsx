import LocalPong from '@/app/_components/gameplay/local/local';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.localGameplay,
};

const Page: React.FC<unknown> = () => {
	return (
		<div className="rounded-md p-[20px]">
			<LocalPong />
		</div>
	);
};

export default Page;
