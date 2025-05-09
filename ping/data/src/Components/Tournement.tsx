import React from 'react';
import { Card, Heading, ScrollArea } from '@radix-ui/themes';

interface TournementProps {
	data: string;
	send: (message: string) => void;
}

export const Tournement: React.FC<TournementProps> = ({ data, send }) => {
	return (
		<Card className="div12">
			<Heading align="center" size="3">
				Tournement
			</Heading>
			<ScrollArea scrollbars="vertical" className="mt-4"></ScrollArea>
		</Card>
	);
};
