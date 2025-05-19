import { Text } from '@radix-ui/themes';
import { useParams } from 'react-router-dom';

const Server: React.FC<unknown> = () => {
	const { game } = useParams();

	return (
		<>
			<Text as="div" align="center" size="3" weight="bold">
				Server
			</Text>
			<Text as="div" align="center" size="3" weight="bold">
				{game}
			</Text>
		</>
	);
};

export default Server;
