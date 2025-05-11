import React from 'react';
import { Card, Heading, ScrollArea } from '@radix-ui/themes';

interface InvitationsProps {
	data: string;
	send: (message: string) => void;
}

export const Invitations: React.FC<InvitationsProps> = ({ data, send }) => {
	return (
		<Card className="div11">
			<Heading align="center" size="3">
				Invitations
			</Heading>
			<ScrollArea scrollbars="vertical" className="mt-4"></ScrollArea>
		</Card>
	);
};
