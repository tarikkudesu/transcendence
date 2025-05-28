import { Avatar, Box, Flex, Text } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { WSC } from '../Hooks/ws-client';

const Home: React.FC<unknown> = () => {
	return (
		<>
			<Box height="24px" />
			<Flex justify="between" className='px-12'>

				<Text as="div" align="center" size="3" weight="bold">
					PONG
				</Text>
				<Flex align="center" gap='4'>
					<Text size="1" weight="bold" className="opacity-80">
						{WSC.username}
					</Text>
					<Avatar size="2" src={WSC.img} radius="full" fallback="T" className="border-2 border-amber-600 p-0.5" />
				</Flex>
			</Flex>
			<Box height="24px" />
			<Outlet />
		</>
	);
};
export default Home;
