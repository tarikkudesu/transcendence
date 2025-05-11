import React from 'react';
import { Card, Heading, ScrollArea } from '@radix-ui/themes';

interface PoolProps {
	data: string;
	send: (message: string) => void;
}

export const Pool: React.FC<PoolProps> = ({ data, send }) => {
	return (
		<Card className="div9">
			<Heading align="center" size="3">
				Online Players
			</Heading>
			<ScrollArea scrollbars="vertical" className="mt-4"></ScrollArea>
		</Card>
	);
};
