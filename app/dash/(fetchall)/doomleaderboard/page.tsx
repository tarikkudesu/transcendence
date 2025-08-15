import Footer from '@/app/_components/Footer';
import { Text } from '@radix-ui/themes';
import Header from '@/app/_components/Header';
import React from 'react';

const Dashboard: React.FC<unknown> = () => {
	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4">
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Doom Cards LeaderBoard
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						Watch ongoing tournament games in real time and track their progress from start to finish.
					</Text>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;
