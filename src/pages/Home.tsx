import { Box, Text } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { WSC } from '../Hooks/ws-client';

const Home: React.FC<unknown> = () => {
	return (
		<>
			<Box height="24px" />
			<Text as="div" align="center" size="3" weight="bold">
				PONG
			</Text>
			<Box height="24px" />
			<Text as="div" align="center" size="3" weight="bold">
				{WSC.username}
			</Text>
			<Box height="24px" />
			<Outlet />
		</>
	);
};
export default Home;
