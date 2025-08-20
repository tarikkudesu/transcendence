'use client';

import { SvgChart } from '@/app/_svg/svg';
import { Separator, Text } from '@radix-ui/themes';

const MyStatsPong: React.FC = ({}) => {


	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8">
			<div className="flex mb-1 mt-2">
				<SvgChart size={24} className="text-white mr-4" />
				<Text as="div" size="5" weight="bold">
					Stats
				</Text>
			</div>
			<Separator size="4" />
		</div>
	);
};

export default MyStatsPong;
