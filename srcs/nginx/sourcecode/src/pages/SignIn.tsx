import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { useContext, useState, type ChangeEvent } from 'react';
import { ConnectMessage, WSC, wsContext } from '../Hooks/ws-client';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC<unknown> = () => {
	const navigate = useNavigate();
	const [pass, setPass] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const { send, hash } = useContext(wsContext);

	async function signIn() {
		if (!username) return;
		send(ConnectMessage(username, ''));
		WSC.username = username;
		return;
	}

	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Card style={{ width: 400, padding: '12px 24px' }}>
				<Box height="24px" />
				<Text size="6" weight="bold">
					Sign In
				</Text>
				<Box height="12px" />
				<Text size="1">Username</Text>
				<Box height="4px" />
				<TextField.Root
					value={username}
					defaultValue={username}
					placeholder="Enter Your Username"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
				></TextField.Root>
				<Box height="12px" />
				<Text size="1">Password</Text>
				<Box height="4px" />
				<TextField.Root value={pass} defaultValue={pass} placeholder="Enter Your Psssword" onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}></TextField.Root>
				<Box height="24px" />
				{!hash ? (
					<Button style={{ width: '100%' }} disabled={!username} onClick={signIn}>
						Sign In
					</Button>
				) : (
					<Button color="orange" style={{ width: '100%' }} onClick={() => navigate('/')}>
						Play
					</Button>
				)}
				<Box height="24px" />
			</Card>
		</div>
	);
};

export default SignIn;
