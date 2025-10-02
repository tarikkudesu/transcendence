import React from 'react';
import { Text } from '@radix-ui/themes';
interface TitleSubTitleProps {
	subtitle: string;
	children: React.ReactNode;
}

const TitleSubTitle: React.FC<TitleSubTitleProps> = ({ children, subtitle }) => {
	return (
		<>
			<Text as="div" mb="2" mt="8" weight="bold" size="8">
				{children}
			</Text>
			<Text as="div" mb="4" mt="2" className="text-sm text-dark-200 mb-20">
				{subtitle}
			</Text>
		</>
	);
};

export default TitleSubTitle;
