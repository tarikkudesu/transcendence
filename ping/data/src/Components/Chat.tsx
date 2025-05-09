import React from 'react';
import { Card, Heading, ScrollArea } from '@radix-ui/themes';

interface ChatProps {
	data: string;
	send: (message: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ data, send }) => {
	return (
		<Card className="div8">
			<Heading align="center" size="3">
				Chat
			</Heading>
			<ScrollArea scrollbars="vertical" className=""></ScrollArea>
		</Card>
	);
};
